// apps/auth/src/auth.service.ts
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import * as bcrypt from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private readonly http: HttpService,
    private readonly jwtService: JwtService,
  ) {}

  async validateUser(email: string, password: string): Promise<any> {
    try {
      const { data: user } = await firstValueFrom(
        this.http.get(`http://user-service:3002/usuarios/by-email/${email}`),
      );

      if (!user) {
        console.log('Usuario no encontrado');
        throw new UnauthorizedException('Usuario no encontrado');
      }

      if (!user.isActive) {
        console.log('Usuario inactivo');
        throw new UnauthorizedException('Usuario inactivo');
      }

      const passwordValid = await bcrypt.compare(password, user.password);

      if (!passwordValid) {
        console.log('Contraseña inválida');
        throw new UnauthorizedException('Contraseña incorrecta');
      }

      const { password: _, ...result } = user;
      return result;
    } catch (error) {
      console.error('Error en validateUser:', error);
      throw new UnauthorizedException('Credenciales incorrectas');
    }
  }

  async login(user: any) {
    if (!user || !user.id || !user.email) {
      throw new UnauthorizedException('Usuario inválido');
    }

    const { data: roles } = await firstValueFrom(
      this.http.get(`http://user-service:3002/usuarios/${user.id}/roles`),
    );

    const payload = {
      name: user.names,
      email: user.email,
      sub: user.id,
      roles: roles,
    };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  async verifyToken(token: string): Promise<any> {
    try {
      const payloda = await this.jwtService.verifyAsync(token, {
        secret: 'jwt-secret-key', //IDEALMENTE CAMBIAR POR UNA VARIABLE DE ENTORNO
      });

      return {
        userId: payloda.sub,
        email: payloda.email,
        roles: payloda.roles,
      };
    } catch (error) {
      throw new UnauthorizedException('Token inválido o expirado');
    }
  }
}
