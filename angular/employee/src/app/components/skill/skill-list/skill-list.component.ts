import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { Subscription, Subject, debounceTime } from 'rxjs';
import { PageEvent } from '../../../models/page-event.model';
import { Skill } from '../../../models/skill.model';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { SkillService } from '../../../services/skill/skill.service';
import { SkillSearchResult } from '../../../models/skill-search-result.model';
import { PaginatorState } from 'primeng/paginator';
import { fireToast } from '../../../shared/utils';
import { CrudOperations } from '../../../shared/crud-operations';

@Component({
    selector: 'app-skill-list',
    templateUrl: './skill-list.component.html',
    styleUrl: './skill-list.component.scss',
    standalone: false
})
export class SkillListComponent implements OnInit, OnDestroy, CrudOperations {
  private skills$!: Subscription;
  private searchSubject = new Subject<Skill>();
  public skillSearch: Skill = {};
  public skillId: number | null = 0;
  public page: PageEvent = {
    page: 0,
    first: 0,
    rows: 5,
    pageCount: 0,
    sort: 'asc',
  };
  public skills: Skill[] = [];
  public visible: boolean = false;
  public editVisible: boolean = false;
  public modalTitle: string = '';
  public disable: boolean = false;
  private skillService: SkillService = inject(SkillService);
  private messageService: MessageService = inject(MessageService);

  ngOnInit(): void {
    this.getAll();
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
      complete: () => { },
    });
  }
  ngOnDestroy(): void {
    this.skills$.unsubscribe();
    this.searchSubject.complete();
  }

  public addNew(): void {
    this.goToEdit(null);
  }

  public checkSearchFields(): boolean {
    return Boolean(this.skillSearch.name);
  }

  public clear(): void {
    this.skillSearch = {};
    this.getAll();
  }

  public delete(): void {
    if (this.skillId) {
      this.skillService.delete(this.skillId).subscribe({
        next: () => {
          this.retrieve();
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
        complete: () => { },
      });
    }
  }

  public getAll(): void {
    const skillObserver: any = {
      next: (value: SkillSearchResult) => {
        this.skills = value.skills ?? [];
        this.page.pageCount = value.size ?? 0;
      },
      error: (err: any) => {
        fireToast('error', 'Error', err.error.message, this.messageService);
      },
      complete: () => { },
    };

    this.skills$ = this.skillService
      .getAllSkills(false, this.page)
      .subscribe(skillObserver);
  }

  public goToDetails(id: number): void {
    this.setEditParams(true, id, `Skill ${id}`, true);
  }

  public goToEdit(id: number | null): void {
    const title = id ?  `Skill ${id}` : 'Add new Skill'
    this.setEditParams(true, id, title, false);
  }

  public handleCancel(event: any): void {
    this.editVisible = event.visible;
    if (event.save) {
      this.refresh();
    }
  }

  public onKeyUp(): void {
    this.retrieve();
  }

  public onPageChange(event: PaginatorState): void {
    this.page.first = event.first ?? 0;
    this.page.page = event.page ?? 0;
    this.page.rows = event.rows ?? 0;
    this.retrieve();
  }

  public refresh(): void {
    this.retrieve();
  }

  public retrieve(): void {
    this.checkSearchFields() ? this.search() : this.getAll();
  }

  public search(): void {
    this.searchSubject.next(this.skillSearch);
  }

  public setEditParams(editVisible: boolean, id: number | null, modalTitle: string, disable: boolean): void {
    this.editVisible = editVisible;
    this.skillId = id;
    this.modalTitle = modalTitle;
    this.disable = disable;
  }

  public showDialog(visible: boolean, id?: number): void {
    this.skillId = id ?? 0;
    this.visible = visible;
  }
}
