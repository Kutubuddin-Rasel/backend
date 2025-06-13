import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { UsersService } from './users/users.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const usersService = app.get(UsersService);

  const adminEmail = process.env.ADMIN_EMAIL;
  const adminPass  = process.env.ADMIN_PASSWORD;
  if (adminEmail && adminPass) {
    // only create if missing
    let admin = await usersService.findByEmail(adminEmail);
    if (!admin) {
      await usersService.create({
        name: 'Administrator',
        email: adminEmail,
        password: adminPass,
        role: 'admin'
      });
      console.log(`Seeded admin user: ${adminEmail}`);
    }
  }
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
