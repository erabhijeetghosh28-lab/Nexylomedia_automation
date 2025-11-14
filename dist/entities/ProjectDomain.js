"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProjectDomain = void 0;
const typeorm_1 = require("typeorm");
const BaseEntity_1 = require("./BaseEntity");
const Project_1 = require("./Project");
const User_1 = require("./User");
let ProjectDomain = class ProjectDomain extends BaseEntity_1.BaseEntity {
    project;
    host;
    status;
    isPrimary;
    verificationToken;
    submittedBy;
    approvedBy;
    approvedAt;
    notes;
};
exports.ProjectDomain = ProjectDomain;
__decorate([
    (0, typeorm_1.ManyToOne)(() => Project_1.Project, (project) => project.domains, {
        onDelete: "CASCADE",
    }),
    (0, typeorm_1.JoinColumn)({ name: "project_id" }),
    __metadata("design:type", Project_1.Project)
], ProjectDomain.prototype, "project", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 255 }),
    __metadata("design:type", String)
], ProjectDomain.prototype, "host", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "nvarchar", length: 20, default: "pending" }),
    __metadata("design:type", String)
], ProjectDomain.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: false }),
    __metadata("design:type", Boolean)
], ProjectDomain.prototype, "isPrimary", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "nvarchar", length: 64, nullable: true }),
    __metadata("design:type", Object)
], ProjectDomain.prototype, "verificationToken", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => User_1.User, { eager: true, onDelete: "NO ACTION" }),
    (0, typeorm_1.JoinColumn)({ name: "submitted_by_id" }),
    __metadata("design:type", User_1.User)
], ProjectDomain.prototype, "submittedBy", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => User_1.User, {
        eager: true,
        nullable: true,
        onDelete: "SET NULL",
    }),
    (0, typeorm_1.JoinColumn)({ name: "approved_by_id" }),
    __metadata("design:type", Object)
], ProjectDomain.prototype, "approvedBy", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "datetime2", nullable: true }),
    __metadata("design:type", Object)
], ProjectDomain.prototype, "approvedAt", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "nvarchar", length: 512, nullable: true }),
    __metadata("design:type", Object)
], ProjectDomain.prototype, "notes", void 0);
exports.ProjectDomain = ProjectDomain = __decorate([
    (0, typeorm_1.Entity)({ name: "project_domains" }),
    (0, typeorm_1.Index)(["project", "host"], { unique: true })
], ProjectDomain);
//# sourceMappingURL=ProjectDomain.js.map