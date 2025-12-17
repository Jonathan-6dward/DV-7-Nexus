import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    return 'DV-7 Nexus Backend - Sistema de Dublagem Neural Ativo!';
  }
}