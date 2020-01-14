import { Injector } from "@angular/core";

export class ServiceLocator {
    private static _injector: Injector;

    static set Injector(injector: Injector) {
        ServiceLocator._injector = injector;
    }

    static get Injector(): Injector {
        return ServiceLocator._injector;
    }
}
