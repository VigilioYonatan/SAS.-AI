import { ClientsApiController } from "@/users/controllers/clients.api.controller";
import { type Type } from "@vigilio/express-core";
import { EmpresasApiController } from "../services/empresas/controllers/empresas.api.controller";
import { UsersApiController } from "@/users/controllers/users.api.controller";
import { ProductsApiController } from "@/products/controllers/products.api.controller";
import { CategoriesApiController } from "@/products/controllers/categories.api.controller";
import { CouponsApiController } from "@/products/controllers/coupons.api.controller";
import { OrdersApiController } from "@/orders/controllers/orders.api.controller";
import { CartApiController } from "@/cart/controllers/cart.api.controller";
import { AuthApiController } from "@/auth/controllers/auth.api.controller";
import { BackupApiController } from "@/empresas/controllers/backup.api.controller";
import { NotificationsApiController } from "@/notificactions/controllers/notifications.api.controller";
import { DetailOrdersApiController } from "@/orders/controllers/detail_orders.api.controller";
import { DocumentsApiController } from "@/orders/controllers/documents.api.controller";
import { GuidesApiController } from "@/orders/controllers/guides.api.controller";
import { InvoicesApiController } from "@/orders/controllers/Invoices.api.controller";
import { KindDebitNotesApiController } from "@/orders/controllers/kind_debit_notes.api.controller";
import { NotesApiController } from "@/orders/controllers/notes.api.controller";
import { PayMethodsApiController } from "@/orders/controllers/pay_methods.api.controller";
import { StatusOrdersApiController } from "@/orders/controllers/status_orders.api.controller";
import { KindCreditNotesApiController } from "@/orders/controllers/kind_credit_notes.api.controller";
import { UbigeoApiController } from "@/ubigeo/controllers/ubigeo.api.controller";
import { BrandsApiController } from "@/products/controllers/brands.api.controller";
import { SeederApiController } from "@/seeders/controllers/seeders.api.controller";
import { PaginatorApiController } from "@/common/paginator/controllers/paginator.api.controller";
import { ServicioApiController } from "@/empresas/controllers/servicio.api.controller";
import { AdminApiController } from "@/admin/controllers/admin.api.controller";
import { SuppliersApiController } from "@/suppliers/controllers/suppliers.api.controller";
import { PostsApiController } from "@/posts/controllers/posts.api.controller";
import { UploadsController } from "@/uploads/controllers/uploads.controller";
import { OptionsApiController } from "@/products/controllers/options/options.api.controller";
import { MesasApiController } from "@/orders/controllers/mesas.api.controller";
import { ComplaintApiController } from "@/empresas/controllers/complaints.api.controller";
import { UrlsController } from "@/urls/controllers/urls.controller";
import { NewApiController } from "@/empresas/controllers/new.api.controller";
import { BackgroundApiController } from "@/empresas/controllers/background.api.controller";
import { SettingsApiController } from "@/empresas/controllers/settings.api.controller";
import { KindInvoiceApiController } from "@/orders/controllers/kind_invoice.api.controller";
import { FloorsApiController } from "@/orders/controllers/floors.api.controller";
import { IAApiController } from "@/bot/controllers/ia.api.controller";
import { whatsappApiController } from "@/bot/controllers/whatsapp.api.controller";
import { WebApiController } from "@/web/controllers/web.api.controller";
import { TelegramApiController } from "@/bot/controllers/telegram.api.controller";
import { CategoriesFinanzasApiController } from "@/finanzas/controllers/categories.api.controller";
import { FinanzasApiController } from "@/finanzas/controllers/finanzas.api.controller";
import { IzipayApiController } from "@/payments/controllers/izipay.api.controller";

export const apiRouters: Type[] = [
	EmpresasApiController,
	ClientsApiController,
	UsersApiController,
	ProductsApiController,
	CategoriesApiController,
	CouponsApiController,
	OrdersApiController,
	CartApiController,
	AuthApiController,
	NotificationsApiController,
	DetailOrdersApiController,
	DocumentsApiController,
	GuidesApiController,
	InvoicesApiController,
	KindCreditNotesApiController,
	KindDebitNotesApiController,
	NotesApiController,
	PayMethodsApiController,
	StatusOrdersApiController,
	BrandsApiController,
	UbigeoApiController,
	SeederApiController,
	PaginatorApiController,
	ServicioApiController,
	AdminApiController,
	SuppliersApiController,
	PostsApiController,
	UploadsController,
	OptionsApiController,
	MesasApiController,
	ComplaintApiController,
	UrlsController,
	NewApiController,
	BackgroundApiController,
	BackupApiController,
	SettingsApiController,
	KindInvoiceApiController,
	FloorsApiController,
	IAApiController,
	whatsappApiController,
	WebApiController,
	TelegramApiController,
	CategoriesFinanzasApiController,
	FinanzasApiController,
	IzipayApiController,
];
