import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription, Subject, debounceTime } from 'rxjs';
import { PageEvent } from '../../../models/page-event.model';
import { Skill } from '../../../models/skill.model';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { SkillService } from '../../../services/skill/skill.service';
import { SkillSearchResult } from '../../../models/skill-search-result.model';
import { PaginatorState } from 'primeng/paginator';
import { fireToast } from '../../../shared/utils';

@Component({
  selector: 'app-skill-list',
  templateUrl: './skill-list.component.html',
  styleUrl: './skill-list.component.scss',
})
export class SkillListComponent implements OnInit, OnDestroy {
  private skills$!: Subscription;
  private searchSubject = new Subject<Skill>();
  skillSearch: Skill = new Skill();
  skillId: number = 0;
  page: PageEvent = {
    page: 0,
    first: 0,
    rows: 5,
    pageCount: 0,
    sort: 'asc',
  };
  skills: Skill[] = [];
  visible: boolean = false;

  constructor(
    private skillService: SkillService,
    private router: Router,
    private messageService: MessageService
  ) { }
  ngOnInit(): void {
    this.getAllSkills();
    this.searchSubject.pipe(debounceTime(2000)).subscribe({
      next: (value) => {
        this.skillService.search(value, this.page).subscribe({
          next: (value) => {
            this.skills = value.skills ?? [];
            this.page.pageCount = value.size ?? 0;
          },
          error: (err) => {
            fireToast('error', 'Error', err.error.message, this.messageService);
          },
        });
      },
      error: (err) => {
        fireToast('error', 'Error', err.error.message, this.messageService);
      },
    });
  }
  ngOnDestroy(): void {
    this.skills$.unsubscribe();
    this.searchSubject.complete();
  }

  public getAllSkills() {
    const skillsObserver: any = {
      next: (value: SkillSearchResult) => {
        this.skills = value.skills ?? [];
        this.page.pageCount = value.size ?? 0;
      },
      error: (err: any) => {
        fireToast('error', 'Error', err.message, this.messageService);
      },
      complete: () => {
        console.log('Completed');
      },
    };
    this.skills$ = this.skillService
      .getAllSkills(false, this.page)
      .subscribe(skillsObserver);
  }

  public addNew() {
    this.router.navigate(['skill/new']);
  }

  onPageChange(event: PaginatorState) {
    this.page.first = event.first ?? 0;
    this.page.page = event.page ?? 0;
    this.page.rows = event.rows ?? 0;
    if (this.skillSearch.name !== undefined && this.skillSearch.name !== '') {
      this.search();
    } else {
      this.getAllSkills();
    }
  }

  showDialog(visible: boolean, skillId?: number) {
    this.skillId = skillId ?? 0;
    this.visible = visible;
  }

  delete() {
    this.skillService.delete(this.skillId).subscribe({
      next: (value: any) => {
        if (
          this.skillSearch.name !== undefined &&
          this.skillSearch.name !== ''
        ) {
          this.search();
        } else {
          this.getAllSkills();
        }
        fireToast(
          'success',
          'success',
          `Skill with id ${this.skillId} has been deleted.`,
          this.messageService
        );
        this.showDialog(false);
      },
      error: (err: any) => {
        fireToast('error', 'Error', err.error.message, this.messageService);
      },
      complete: () => {
        console.log('Completed');
      },
    });
  }

  onKeyUp() {
    if (this.skillSearch.name !== undefined && this.skillSearch.name !== '') {
      this.search();
    } else {
      this.getAllSkills();
    }
  }

  clear() {
    this.skillSearch = new Skill();
    this.getAllSkills();
  }

  public refresh() {
    if (
      (this.skillSearch.name !== undefined &&
        this.skillSearch.name !== '')
    ) {
      this.search();
    } else {
      this.getAllSkills();
    }
  }

  search() {
    console.log(this.skillSearch);
    this.searchSubject.next(this.skillSearch);
  }

  goToDetails(skillId: number) {
    this.router.navigate([`skill/details/$${skillId}`]);
  }

  goToEdit(skillId: number) {
    this.router.navigate([`skill/edit/${skillId}`]);
  }
}
