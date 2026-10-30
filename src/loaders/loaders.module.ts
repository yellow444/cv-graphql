import { Module } from '@nestjs/common';
import { ExperienceModule } from '../experience/experience.module';
import { ProfileModule } from '../profile/profile.module';
import { ProjectsModule } from '../projects/projects.module';
import { SkillsModule } from '../skills/skills.module';
import { LoadersFactory } from './loaders.factory';

@Module({
  imports: [ProfileModule, SkillsModule, ExperienceModule, ProjectsModule],
  providers: [LoadersFactory],
  exports: [LoadersFactory],
})
export class LoadersModule {}
