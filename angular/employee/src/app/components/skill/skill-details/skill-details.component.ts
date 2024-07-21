import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Skill } from '../../../models/skill.model';

@Component({
  selector: 'app-skill-details',
  templateUrl: './skill-details.component.html',
  styleUrl: './skill-details.component.scss'
})
export class SkillDetailsComponent implements OnInit{
  skill!: Skill;
  constructor(private route: ActivatedRoute, private router: Router) { }
  ngOnInit(): void {
    this.skill = this.route.snapshot.data['skill'];
  }

  back() {
    this.router.navigate(["skill/list"])
  }
}
