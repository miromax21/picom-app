import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ErrorInterceptor } from './interceptors/error.interceptor';
import { TooltipComponent } from './components/tooltip/tooltip.component';
@NgModule({
    imports: [
        CommonModule,
        HttpClientModule,
        RouterModule,
        FormsModule
    ],
    declarations: [
        TooltipComponent
    ],
    exports: [
        TooltipComponent
    ]
})
export class SharedModule {
    static forRoot(): ModuleWithProviders {
        return {
            ngModule: SharedModule,
            providers: [
                DatePipe,
                {
                    provide: HTTP_INTERCEPTORS,
                    useClass: ErrorInterceptor,
                    multi: true
                },
            ]
        };
    }

}
