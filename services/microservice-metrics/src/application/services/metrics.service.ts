import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class MetricsService {
  constructor(private readonly http: HttpService) {}

  async getUsersCountByRole(): Promise<{ role: string; count: number }[]> {
    const { data } = await firstValueFrom(
      this.http.get('http://user-service:3002/usuarios/count-by-role'),
    );
    return data.map((entry: any) => ({
      role: entry.role,
      count: parseInt(entry.count, 10),
    }));
  }
}
