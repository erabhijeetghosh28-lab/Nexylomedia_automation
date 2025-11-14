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
exports.Integration = void 0;
const typeorm_1 = require("typeorm");
const BaseEntity_1 = require("./BaseEntity");
const Tenant_1 = require("./Tenant");
const User_1 = require("./User");
let Integration = class Integration extends BaseEntity_1.BaseEntity {
    tenant;
    user;
    provider;
    keyMask;
    secretRef;
    scope;
    status;
    configJson;
};
exports.Integration = Integration;
__decorate([
    (0, typeorm_1.ManyToOne)(() => Tenant_1.Tenant, { nullable: true, onDelete: "CASCADE" }),
    (0, typeorm_1.JoinColumn)({ name: "tenant_id" }),
    __metadata("design:type", Object)
], Integration.prototype, "tenant", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => User_1.User, { nullable: true, onDelete: "CASCADE" }),
    (0, typeorm_1.JoinColumn)({ name: "user_id" }),
    __metadata("design:type", Object)
], Integration.prototype, "user", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "nvarchar", length: 64 }),
    __metadata("design:type", String)
], Integration.prototype, "provider", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "nvarchar", length: 128 }),
    __metadata("design:type", String)
], Integration.prototype, "keyMask", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "nvarchar", length: 512 }),
    __metadata("design:type", String)
], Integration.prototype, "secretRef", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "nvarchar", length: 16 }),
    __metadata("design:type", String)
], Integration.prototype, "scope", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "nvarchar", length: 16, default: "untested" }),
    __metadata("design:type", String)
], Integration.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.Column)("simple-json", { nullable: true }),
    __metadata("design:type", Object)
], Integration.prototype, "configJson", void 0);
exports.Integration = Integration = __decorate([
    (0, typeorm_1.Entity)({ name: "integrations" }),
    (0, typeorm_1.Index)(["tenant", "provider"]),
    (0, typeorm_1.Index)(["user", "provider"])
], Integration);
//# sourceMappingURL=Integration.js.map