import { HttpModule } from "@nestjs/axios";
import { Module } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { PrismaModule } from "src/prisma/prisma.module";
import { FilesModule } from "src/utils/files/files.module";
import { UrlModule } from "src/utils/urls/urls.module";
import { VariableController } from "./variable.controller";
import { VariableService } from "./variable.service";

@Module({
    imports: [PrismaModule],
    controllers: [VariableController],
    providers: [JwtService, VariableService]
})

export class VariableModule { }