jest.mock("@angular/router");

import { ComponentFixture, TestBed } from "@angular/core/testing";
import { HttpResponse } from "@angular/common/http";
import { HttpClientTestingModule } from "@angular/common/http/testing";
import { FormBuilder } from "@angular/forms";
import { ActivatedRoute } from "@angular/router";
import { of, Subject } from "rxjs";

import { GroupService } from "../service/group.service";
import { IGroup, Group } from "../group.model";

import { IUser } from "app/entities/user/user.model";
import { UserService } from "app/entities/user/user.service";

import { GroupUpdateComponent } from "./group-update.component";

describe("Component Tests", () => {
  describe("Group Management Update Component", () => {
    let comp: GroupUpdateComponent;
    let fixture: ComponentFixture<GroupUpdateComponent>;
    let activatedRoute: ActivatedRoute;
    let groupService: GroupService;
    let userService: UserService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        declarations: [GroupUpdateComponent],
        providers: [FormBuilder, ActivatedRoute],
      })
        .overrideTemplate(GroupUpdateComponent, "")
        .compileComponents();

      fixture = TestBed.createComponent(GroupUpdateComponent);
      activatedRoute = TestBed.inject(ActivatedRoute);
      groupService = TestBed.inject(GroupService);
      userService = TestBed.inject(UserService);

      comp = fixture.componentInstance;
    });

    describe("ngOnInit", () => {
      it("Should call User query and add missing value", () => {
        const group: IGroup = { id: 456 };
        const internalUser: IUser = { id: 10422 };
        group.internalUser = internalUser;

        const userCollection: IUser[] = [{ id: 31950 }];
        jest
          .spyOn(userService, "query")
          .mockReturnValue(of(new HttpResponse({ body: userCollection })));
        const additionalUsers = [internalUser];
        const expectedCollection: IUser[] = [
          ...additionalUsers,
          ...userCollection,
        ];
        jest
          .spyOn(userService, "addUserToCollectionIfMissing")
          .mockReturnValue(expectedCollection);

        activatedRoute.data = of({ group });
        comp.ngOnInit();

        expect(userService.query).toHaveBeenCalled();
        expect(userService.addUserToCollectionIfMissing).toHaveBeenCalledWith(
          userCollection,
          ...additionalUsers
        );
        expect(comp.usersSharedCollection).toEqual(expectedCollection);
      });

      it("Should update editForm", () => {
        const group: IGroup = { id: 456 };
        const internalUser: IUser = { id: 83534 };
        group.internalUser = internalUser;

        activatedRoute.data = of({ group });
        comp.ngOnInit();

        expect(comp.editForm.value).toEqual(expect.objectContaining(group));
        expect(comp.usersSharedCollection).toContain(internalUser);
      });
    });

    describe("save", () => {
      it("Should call update service on save for existing entity", () => {
        // GIVEN
        const saveSubject = new Subject<HttpResponse<Group>>();
        const group = { id: 123 };
        jest.spyOn(groupService, "update").mockReturnValue(saveSubject);
        jest.spyOn(comp, "previousState");
        activatedRoute.data = of({ group });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.next(new HttpResponse({ body: group }));
        saveSubject.complete();

        // THEN
        expect(comp.previousState).toHaveBeenCalled();
        expect(groupService.update).toHaveBeenCalledWith(group);
        expect(comp.isSaving).toEqual(false);
      });

      it("Should call create service on save for new entity", () => {
        // GIVEN
        const saveSubject = new Subject<HttpResponse<Group>>();
        const group = new Group();
        jest.spyOn(groupService, "create").mockReturnValue(saveSubject);
        jest.spyOn(comp, "previousState");
        activatedRoute.data = of({ group });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.next(new HttpResponse({ body: group }));
        saveSubject.complete();

        // THEN
        expect(groupService.create).toHaveBeenCalledWith(group);
        expect(comp.isSaving).toEqual(false);
        expect(comp.previousState).toHaveBeenCalled();
      });

      it("Should set isSaving to false on error", () => {
        // GIVEN
        const saveSubject = new Subject<HttpResponse<Group>>();
        const group = { id: 123 };
        jest.spyOn(groupService, "update").mockReturnValue(saveSubject);
        jest.spyOn(comp, "previousState");
        activatedRoute.data = of({ group });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.error("This is an error!");

        // THEN
        expect(groupService.update).toHaveBeenCalledWith(group);
        expect(comp.isSaving).toEqual(false);
        expect(comp.previousState).not.toHaveBeenCalled();
      });
    });

    describe("Tracking relationships identifiers", () => {
      describe("trackUserById", () => {
        it("Should return tracked User primary key", () => {
          const entity = { id: 123 };
          const trackResult = comp.trackUserById(0, entity);
          expect(trackResult).toEqual(entity.id);
        });
      });
    });
  });
});
