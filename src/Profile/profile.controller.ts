import { Controller, Post, Get, UploadedFile, UseInterceptors, BadRequestException } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { ProfileService } from './profile.service';

@Controller('upload-profile')
export class ProfileController {
    constructor(private readonly profileService: ProfileService) {}

    @Post()
    @UseInterceptors(
        FileInterceptor('image', {
            storage: diskStorage({
                destination: './uploads/profiles',
                filename: (req, file, callback) => {
                    const uniqueName = `${Date.now()}${extname(file.originalname)}`;
                    callback(null, uniqueName);
                },
            }),
            fileFilter: (req, file, callback) => {
                const allowedMimeTypes = [
                    'image/jpeg',
                    'image/jpg',
                    'image/png',
                    'image/gif',
                    'image/webp',
                ];
                if (allowedMimeTypes.includes(file.mimetype)) {
                    callback(null, true);
                } else {
                    callback(
                        new BadRequestException(
                            'Invalid file type. Only JPEG, JPG, PNG, GIF, and WEBP are allowed!',
                        ),
                        false,
                    );
                }
            },
            limits: {
                fileSize: 10 * 1024 * 1024, // 10MB
            },
        }),
    )
    async uploadProfileImage(@UploadedFile() file: Express.Multer.File) {
        if (!file) {
            throw new BadRequestException('No file uploaded.'); 
        }

        // Build the full URL including your backend URL
        const fileUrl = `http://192.168.0.22:4242/uploads/profiles/${file.filename}`;
        return this.profileService.saveProfile(fileUrl);
    }
}
