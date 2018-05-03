import { NgModule, NO_ERRORS_SCHEMA } from "@angular/core";
import { NativeScriptModule } from "nativescript-angular/nativescript.module";
import { TNSFontIconModule } from 'nativescript-ngx-fonticon';

import { HomeRouting } from "./home.routing";
import { HomeComponent } from "./home.component";

@NgModule({
    imports: [
        NativeScriptModule,
        HomeRouting,
        TNSFontIconModule.forRoot({
            fa: './fonts/font-awesome.css'
        })
    ],
    declarations: [HomeComponent],
    schemas: [NO_ERRORS_SCHEMA]
})
export class HomeModule {}
