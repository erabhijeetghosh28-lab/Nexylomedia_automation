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
exports.Project = void 0;
const typeorm_1 = require("typeorm");
const BaseEntity_1 = require("./BaseEntity");
const Tenant_1 = require("./Tenant");
const User_1 = require("./User");
const ProjectDomain_1 = require("./ProjectDomain");
const SitePage_1 = require("./SitePage");
const SeoAudit_1 = require("./SeoAudit");
let Project = class Project extends BaseEntity_1.BaseEntity {
    tenant;
    createdBy;
    name;
    slug;
    status;
    description;
    domains;
    pages;
    audits;
};
exports.Project = Project;
__decorate([
    (0, typeorm_1.ManyToOne)(() => Tenant_1.Tenant, (tenant) => tenant.projects, {
        eager: true,
        onDelete: "CASCADE",
    }),
    (0, typeorm_1.JoinColumn)({ name: "tenant_id" }),
    __metadata("design:type", Tenant_1.Tenant)
], Project.prototype, "tenant", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => User_1.User, (user) => user.createdProjects, {
        eager: true,
        onDelete: "NO ACTION",
    }),
    (0, typeorm_1.JoinColumn)({ name: "created_by_id" }),
    __metadata("design:type", User_1.User)
], Project.prototype, "createdBy", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "nvarchar", length: 120 }),
    __metadata("design:type", String)
], Project.prototype, "name", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "nvarchar", length: 160 }),
    __metadata("design:type", String)
], Project.prototype, "slug", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "nvarchar", length: 20, default: "active" }),
    __metadata("design:type", String)
], Project.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "nvarchar", length: 512, nullable: true }),
    __metadata("design:type", Object)
], Project.prototype, "description", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => ProjectDomain_1.ProjectDomain, (domain) => domain.project),
    __metadata("design:type", Array)
], Project.prototype, "domains", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => SitePage_1.SitePage, (page) => page.project, {
        cascade: ["remove"],
    }),
    __metadata("design:type", Array)
], Project.prototype, "pages", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => SeoAudit_1.SeoAudit, (audit) => audit.project),
    __metadata("design:type", Array)
], Project.prototype, "audits", void 0);
exports.Project = Project = __decorate([
    (0, typeorm_1.Entity)({ name: "projects" }),
    (0, typeorm_1.Index)(["tenant", "slug"], { unique: true })
], Project);
//# sourceMappingURL=Project.js.map