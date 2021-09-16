import { Component, OnInit } from "@angular/core";
import { HttpResponse } from "@angular/common/http";
import { FormBuilder } from "@angular/forms";
import { ActivatedRoute } from "@angular/router";
import { Observable } from "rxjs";
import { finalize, map } from "rxjs/operators";

import { IGroup, Group } from "../group.model";
import { GroupService } from "../service/group.service";
import { IUser } from "app/entities/user/user.model";
import { UserService } from "app/entities/user/user.service";

@Component({
  selector: "jhi-group-update",
  templateUrl: "./group-update.component.html",
})
export class GroupUpdateComponent implements OnInit {
  isSaving = false;

  usersSharedCollection: IUser[] = [];

  editForm = this.fb.group({
    id: [],
    name: [null, []],
    isDefault: [],
    internalUser: [],
  });

  constructor(
    protected groupService: GroupService,
    protected userService: UserService,
    protected activatedRoute: ActivatedRoute,
    protected fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ group }) => {
      this.updateForm(group);

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const group = this.createFromForm();
    if (group.id !== undefined) {
      this.subscribeToSaveResponse(this.groupService.update(group));
    } else {
      this.subscribeToSaveResponse(this.groupService.create(group));
    }
  }

  trackUserById(index: number, item: IUser): number {
    return item.id!;
  }

  protected subscribeToSaveResponse(
    result: Observable<HttpResponse<IGroup>>
  ): void {
    result.pipe(finalize(() => this.onSaveFinalize())).subscribe(
      () => this.onSaveSuccess(),
      () => this.onSaveError()
    );
  }

  protected onSaveSuccess(): void {
    this.previousState();
  }

  protected onSaveError(): void {
    // Api for inheritance.
  }

  protected onSaveFinalize(): void {
    this.isSaving = false;
  }

  protected updateForm(group: IGroup): void {
    this.editForm.patchValue({
      id: group.id,
      name: group.name,
      isDefault: group.isDefault,
      internalUser: group.internalUser,
    });

    this.usersSharedCollection = this.userService.addUserToCollectionIfMissing(
      this.usersSharedCollection,
      group.internalUser
    );
  }

  protected loadRelationshipsOptions(): void {
    this.userService
      .query()
      .pipe(map((res: HttpResponse<IUser[]>) => res.body ?? []))
      .pipe(
        map((users: IUser[]) =>
          this.userService.addUserToCollectionIfMissing(
            users,
            this.editForm.get("internalUser")!.value
          )
        )
      )
      .subscribe((users: IUser[]) => (this.usersSharedCollection = users));
  }

  protected createFromForm(): IGroup {
    return {
      ...new Group(),
      id: this.editForm.get(["id"])!.value,
      name: this.editForm.get(["name"])!.value,
      isDefault: this.editForm.get(["isDefault"])!.value,
      internalUser: this.editForm.get(["internalUser"])!.value,
    };
  }
}
