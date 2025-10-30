import {
  Injectable,
  UnauthorizedException,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';

import { User, UserRole } from '../database/entities/user.entity';
import { Patient } from '../database/entities/patient.entity';
import { Professional } from '../database/entities/professional.entity';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { AuditLogsService } from '../modules/audit-logs/audit-logs.service';
import { AuditAction } from '../database/entities/audit-log.entity';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    @InjectRepository(Patient)
    private patientsRepository: Repository<Patient>,
    @InjectRepository(Professional)
    private professionalsRepository: Repository<Professional>,
    private jwtService: JwtService,
    private auditLogsService: AuditLogsService,
  ) {}

  async register(registerDto: RegisterDto, ipAddress: string, userAgent: string) {
    // Check if user exists
    const existingUser = await this.usersRepository.findOne({
      where: { email: registerDto.email },
    });

    if (existingUser) {
      throw new ConflictException('User with this email already exists');
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(
      registerDto.password,
      parseInt(process.env.BCRYPT_ROUNDS || '10'),
    );

    let user: User;

    // Create user based on role
    if (registerDto.role === UserRole.PATIENT) {
      if (!registerDto.dateOfBirth) {
        throw new BadRequestException('Date of birth is required for patients');
      }

      const patient = this.patientsRepository.create({
        email: registerDto.email,
        password: hashedPassword,
        firstName: registerDto.firstName,
        lastName: registerDto.lastName,
        role: UserRole.PATIENT,
        dateOfBirth: registerDto.dateOfBirth,
        phoneNumber: registerDto.phoneNumber,
      });

      user = await this.patientsRepository.save(patient);
    } else if (registerDto.role === UserRole.PROFESSIONAL) {
      if (!registerDto.specialty || !registerDto.licenseNumber || !registerDto.licenseAuthority) {
        throw new BadRequestException(
          'Specialty, license number, and license authority are required for professionals',
        );
      }

      const professional = this.professionalsRepository.create({
        email: registerDto.email,
        password: hashedPassword,
        firstName: registerDto.firstName,
        lastName: registerDto.lastName,
        role: UserRole.PROFESSIONAL,
        specialty: registerDto.specialty,
        licenseNumber: registerDto.licenseNumber,
        licenseAuthority: registerDto.licenseAuthority,
        phoneNumber: registerDto.phoneNumber,
      });

      user = await this.professionalsRepository.save(professional);
    } else {
      throw new BadRequestException('Invalid role');
    }

    // Generate tokens
    const tokens = await this.generateTokens(user);

    // Save refresh token
    user.refreshToken = await bcrypt.hash(tokens.refreshToken, 10);
    await this.usersRepository.save(user);

    // Audit log
    await this.auditLogsService.log({
      action: AuditAction.LOGIN,
      userId: user.id,
      userRole: user.role,
      ipAddress,
      userAgent,
      success: true,
    });

    // Return user without password
    const { password, refreshToken, ...userWithoutPassword } = user;

    return {
      user: userWithoutPassword,
      ...tokens,
    };
  }

  async login(loginDto: LoginDto, ipAddress: string, userAgent: string) {
    const user = await this.validateUser(loginDto.email, loginDto.password);

    if (!user) {
      // Audit failed login
      await this.auditLogsService.log({
        action: AuditAction.LOGIN_FAILED,
        userId: 'unknown',
        userRole: UserRole.PATIENT, // Default
        ipAddress,
        userAgent,
        success: false,
        errorCode: 'INVALID_CREDENTIALS',
      });

      throw new UnauthorizedException('Invalid credentials');
    }

    // Generate tokens
    const tokens = await this.generateTokens(user);

    // Save refresh token
    user.refreshToken = await bcrypt.hash(tokens.refreshToken, 10);
    await this.usersRepository.save(user);

    // Audit successful login
    await this.auditLogsService.log({
      action: AuditAction.LOGIN,
      userId: user.id,
      userRole: user.role,
      ipAddress,
      userAgent,
      success: true,
    });

    // Get full user profile
    const userWithProfile = await this.getUserWithProfile(user.id);

    // Return user without password
    const { password, refreshToken, ...userWithoutPassword } = userWithProfile;

    return {
      user: userWithoutPassword,
      ...tokens,
    };
  }

  async validateUser(email: string, password: string): Promise<User | null> {
    const user = await this.usersRepository.findOne({ where: { email } });

    if (!user) {
      return null;
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return null;
    }

    return user;
  }

  async getUserWithProfile(userId: string): Promise<User> {
    const user = await this.usersRepository.findOne({ where: { id: userId } });

    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    // Get specific profile based on role
    if (user.role === UserRole.PATIENT) {
      const patient = await this.patientsRepository.findOne({ where: { id: userId } });
      if (!patient) throw new UnauthorizedException('Patient profile not found');
      return patient;
    } else if (user.role === UserRole.PROFESSIONAL) {
      const professional = await this.professionalsRepository.findOne({
        where: { id: userId },
        relations: ['center'],
      });
      if (!professional) throw new UnauthorizedException('Professional profile not found');
      return professional;
    }

    return user;
  }

  async refreshTokens(userId: string, refreshToken: string) {
    const user = await this.usersRepository.findOne({ where: { id: userId } });

    if (!user || !user.refreshToken) {
      throw new UnauthorizedException('Invalid refresh token');
    }

    const isRefreshTokenValid = await bcrypt.compare(refreshToken, user.refreshToken);

    if (!isRefreshTokenValid) {
      throw new UnauthorizedException('Invalid refresh token');
    }

    const tokens = await this.generateTokens(user);

    // Save new refresh token
    user.refreshToken = await bcrypt.hash(tokens.refreshToken, 10);
    await this.usersRepository.save(user);

    return tokens;
  }

  async logout(userId: string, ipAddress: string, userAgent: string) {
    const user = await this.usersRepository.findOne({ where: { id: userId } });

    if (user) {
      user.refreshToken = undefined;
      await this.usersRepository.save(user);

      // Audit logout
      await this.auditLogsService.log({
        action: AuditAction.LOGOUT,
        userId: user.id,
        userRole: user.role,
        ipAddress,
        userAgent,
        success: true,
      });
    }
  }

  private async generateTokens(user: User) {
    const payload = {
      sub: user.id,
      email: user.email,
      role: user.role,
    };

    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(payload, {
        secret: process.env.JWT_SECRET,
        expiresIn: process.env.JWT_EXPIRATION || '1h',
      }),
      this.jwtService.signAsync(payload, {
        secret: process.env.JWT_REFRESH_SECRET,
        expiresIn: process.env.JWT_REFRESH_EXPIRATION || '7d',
      }),
    ]);

    return {
      token: accessToken,
      refreshToken,
    };
  }
}
