import { Injectable } from '@nestjs/common';

@Injectable()
export class ProfileService {
    async saveProfile(fileUrl: string): Promise<{ message: string; url: string }> {
        // Save to database if needed or process further
        return {
            message: 'Profile image uploaded successfully',
            url: fileUrl,
        };
    }
}
