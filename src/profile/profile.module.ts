import { Module } from '@nestjs/common';
import { SkillsModule } from '../skills/skills.module';
import { ProfileRepository } from './profile.repository';
import { ProfileResolver } from './profile.resolver';
import { ProfileService } from './profile.service';

@Module({
  imports: [SkillsModule],
  providers: [ProfileRepository, ProfileService, ProfileResolver],
  exports: [ProfileService],
})
export class ProfileModule {}
