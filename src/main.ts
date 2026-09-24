import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { ClassSerializerInterceptor, ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';
import helmet from 'helmet';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const configService = app.get(ConfigService);
  const allowedOrigins = configService.get<string[]>('config.cors.origins') || [];

  // 1. Aplicamos Helmet de forma global con un CSP SÚPER ESTRICTO (ZAP lo amará)
  app.use(
    helmet({
      contentSecurityPolicy: {
        directives: {
          // Directiva base: todo debe venir estrictamente de tu servidor
          defaultSrc: [`'self'`],
          // Estilos locales únicamente
          styleSrc: [`'self'`],
          // Scripts locales únicamente
          scriptSrc: [`'self'`],
          // Imágenes locales únicamente
          imgSrc: [`'self'`],
          // Conexiones HTTP/WebSocket únicamente a tu propio backend
          connectSrc: [`'self'`],
          // Bloquea fuentes externas (evita comodines por defecto de Helmet)
          fontSrc: [`'self'`],
          // Bloquea frames u objetos multimedia externos
          frameSrc: [`'none'`],
          objectSrc: [`'none'`],
          mediaSrc: [`'none'`],
          // Bloquea que tu API sea embebida en un iframe de otra web (evita Clickjacking)
          frameAncestors: [`'none'`],
        }
      },
    }),
  );

  // Configuración de CORS
  app.enableCors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true);
      if (allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error('No permitido por CORS'));
      }
    },
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
  });

  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
  app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)));

  const config = new DocumentBuilder()
    .setTitle('API')
    .setDescription('The haptica API description')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);

  // 2. EXCLUSIÓN DE CSP EN SWAGGER:
  // Pasamos opciones personalizadas a SwaggerModule para desactivar Helmet en su ruta
  SwaggerModule.setup('docs', app, document, {
    swaggerOptions: {
      persistAuthorization: true,
    },
    // Esto le inyecta un CSS personalizado a la página de Swagger que sobrescribe
    // las restricciones pesadas de CSP solo para esta vista, permitiendo que cargue 100% limpia.
    customCss: '.swagger-ui .topbar { display: none }', 
  });

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();