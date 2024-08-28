import { ClientsApiController } from "@/users/controllers/clients.api.controller";
import { type Type } from "@vigilio/express-core";
import { InformationApiController } from "../services/information/controllers/information.api.controller";
import { UsersApiController } from "@/users/controllers/users.api.controller";
import { ProductsApiController } from "@/products/controllers/products.api.controller";
import { CategoriesApiController } from "@/products/controllers/categories.api.controller";
import { CouponsApiController } from "@/products/controllers/coupons.api.controller";
import { OrdersApiController } from "@/orders/controllers/orders.api.controller";
import { PaymentApiController } from "@/payments/controllers/payment.api.controller";
import { CartApiController } from "@/cart/controllers/cart.api.controller";
import { BotApiController } from "@/bot/controllers/bot.api.controller";
import { AuthApiController } from "@/auth/controllers/auth.api.controller";
import { BackupApiController } from "@/information/controllers/backup.api.controller";
import { NotificationsApiController } from "@/notificactions/controllers/notifications.api.controller";
import { DetailOrdersApiController } from "@/orders/controllers/detail_orders.api.controller";
import { DocumentsApiController } from "@/orders/controllers/documents.api.controller";
import { GuidesApiController } from "@/orders/controllers/guides.api.controller";
import { InvoicesApiController } from "@/orders/controllers/Invoices.api.controller";
import { KindDebitNotesApiController } from "@/orders/controllers/kind_debit_notes.api.controller";
import { NotesApiController } from "@/orders/controllers/notes.api.controller";
import { PayMethodsApiController } from "@/orders/controllers/pay_methods.api.controller";
import { StatusOrdersApiController } from "@/orders/controllers/status_orders.api.controller";
import { TicketApiController } from "@/orders/controllers/ticket.api.controller";
import { KindCreditNotesApiController } from "@/orders/controllers/kind_credit_notes.api.controller";
import { UbigeoApiController } from "@/ubigeo/controllers/ubigeo.api.controller";
import { BrandsApiController } from "@/products/controllers/brands.api.controller";
import { SeederApiController } from "@/seeders/controllers/seeders.api.controller";
import { PaginatorApiController } from "@/common/paginator/controllers/paginator.api.controller";
import { ServicioApiController } from "@/information/controllers/servicio.api.controller";
import { AdminApiController } from "@/admin/controllers/admin.api.controller";

export const apiRouters: Type[] = [
    InformationApiController,
    ClientsApiController,
    UsersApiController,
    ProductsApiController,
    CategoriesApiController,
    CouponsApiController,
    OrdersApiController,
    PaymentApiController,
    CartApiController,
    BotApiController,
    AuthApiController,
    BackupApiController,
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
    TicketApiController,
    BrandsApiController,
    UbigeoApiController,
    SeederApiController,
    PaginatorApiController,
    ServicioApiController,
    AdminApiController,
];
