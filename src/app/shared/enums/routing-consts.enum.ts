export enum RoutingConsts {
    /**
     * главная
     */
    root = "",
    /**
     * weather
     */
    weather = "weather",
     /**
     * страница не найдена
     */
    pageNotFound = "page-not-found",
    /**
    * ошибка сервера
    */
   internalServerError = "server-error"


}
export const ERROR_ROUTES: RoutingConsts[] = [
    RoutingConsts.pageNotFound, 
    RoutingConsts.internalServerError
];
