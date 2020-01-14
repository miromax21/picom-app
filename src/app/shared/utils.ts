
export interface IOneArgSortFunc<T> {
    (a: T): any;
}

export interface ITwoArgSortFunc<T> {
    (a: T, b: T): -1 | 0 | 1;
}

export var Utils = {

    IsNullOrUndefined: (val): boolean => val === null || val === undefined,
    IsEmptyArray: (val: any[]): boolean => val === null || val === undefined || val.length == 0,
    /**
     * Проверяет, является ли значение строкой
     */
    IsString: (val: any): boolean => typeof val === 'string',
    /**
     * Проверяет, является ли значение числом, работает для чисел в строковом виде
     */
    IsNumeric: (val: any): boolean => +val === parseFloat(val),
    /**
     * Проверяет, является ли значение массивом
     */
    IsArray: (val: any): boolean => val instanceof Array,
    /**
     * Проверяет, является ли значение объектом, массив вернёт false
     */
    IsObject: (val: any): boolean => typeof val === 'object' && !Utils.IsNullOrUndefined(val) && !Utils.IsArray(val),
    /**
     * Проверяет, является ли значение функцией
     */
    IsFunction: (val: any): boolean => typeof val === 'function',
    /**
     * Проверяет, является ли значение экземпляром класса Date
     */
    IsDate: (val: any): boolean => val instanceof Date,
    /**
     * Проверяет, является ли значение NaN
     */
    IsNaN: (val: any): boolean => typeof val === 'number' && val.toString() === "NaN",
   


    Array: {
        /**
         * Проверяет, содержит ли массив array хотя бы один элемент, удовлетворяющий условию, заданному в predicate
         */
        Any: <T>(array: T[], predicate: (elem: T, index?: number, array?: T[]) => boolean): boolean => {
            if (!Utils.IsArray(array))
                return false;
            return array.some((elem: T, index: number, array: T[]) => predicate(elem, index, array));
        },
        /**
         * Проверяет, все ли элементы массива array удовлетворяют условию, заданному в predicate
         */
        All: <T>(array: T[], predicate: (elem: T, index?: number, array?: T[]) => boolean): boolean => {
            if (!Utils.IsArray(array))
                return false;
            return array.every((elem: T, index: number, array: T[]) => predicate(elem, index, array));
        },
        /**
         * Проверяет, содержит ли массив array элемент (используется строгое равенство)
         */
        Contains: <T>(array: T[], elem: T): boolean => {
            if (!Utils.IsArray(array))
                return false;
            return array.indexOf(elem) !== -1;
        },
        /**
         * Сортирует массив
         * @param compare_function может быть функцией одного или двух аргументов или undefined (по умолчанию undefined)
         * - если принимает 1 аргумент:
         * сортируется по значению, возвращаемому функцией
         * - если принимает 2 аргумента:
         * a должно располагаться перед b - то результат равен -1;
         * b перед a - 1;
         * оставить взаимное расположение как есть - 0 (не во всех браузерах гарантируется) 
         * @param in_place сортировать ли исходный массив или вернуть новый массив (по умолчанию true)
         */
        Sort: <T>(array: T[], compare_function: IOneArgSortFunc<T> | ITwoArgSortFunc<T> = undefined, in_place: boolean = true): T[] => {
            if (!Utils.IsArray(array))
                return [];
            if (!in_place)
                array = Utils.Array.Map(array, (el) => el);
            let compare: (a: T, b: T) => -1 | 0 | 1;
            if (Utils.IsFunction(compare_function) && compare_function.length === 1)
                compare = function (a: T, b: T) {
                    let resA = (<(a: T) => any>compare_function)(a);
                    let resB = (<(a: T) => any>compare_function)(b);
                    if (resA > resB)
                        return 1;
                    else if (resA < resB)
                        return -1;
                    else
                        return 0;
                };
            else if (Utils.IsNullOrUndefined(compare_function))
                compare = undefined;
            else
                compare = compare_function;

            return array.sort(compare);
        },
        /**
         * Фильтрует массив array по условию, заданному в predicate
         */
        Where: <T>(array: T[], predicate: (elem: T, index?: number, array?: T[]) => boolean): T[] => {
            if (!Utils.IsArray(array))
                return [];
            return array.filter((elem: T, index: number, array: T[]): boolean => predicate(elem, index, array));
        },
        /**
         * Находит первый элемент в массиве array по условию, заданному в predicate, и возвращает его
         */
        WhereFirst: <T>(array: T[], predicate: (elem: T, index?: number, array?: T[]) => boolean): T => {
            if (!Utils.IsArray(array))
                return null;
            return array.find((elem: T, index: number, array: T[]): boolean => predicate(elem, index, array));
        },
        /**
         * Преобразует массив array согласно функции predicate
         */
        Map: <T, T1>(array: T[], predicate: (elem: T, index?: number, array?: T[]) => T1): T1[] => {
            if (!Utils.IsArray(array))
                return [];
            return array.map((elem: T, index: number, array: T[]): T1 => predicate(elem, index, array));
        },
        /**
         * Создаёт копию текущего массива
         */
        Clone: <T>(array: T[]): T[] => {
            if (!Utils.IsArray(array))
                return [];
            return array.slice();
        }, 
        /**
         * Перебор по массиву
         */
        ForEach: <T>(array: T[], predicate: (elem: T, index?: number, array?: T[]) => void): void => {
            if (!Utils.IsArray(array))
                return;
            array.forEach((elem: T, index: number, array: T[]) => predicate(elem, index, array));
        },
        /**
         * Удаляет повторяющиеся элементы
         */
        Distinct: <T>(array: T[]): T[] => {
            return Utils.Array.Where(array, (el, index, array) => array.indexOf(el) === index);
        },
       
        OrderBy: <T, T1>(array: T[], predicate: (elem: T) => T1): T[] => {
            return (array || []).sort((a: T, b: T) => predicate(a) < predicate(b) ? -1 : 1)
        },
        OrderByDescending: <T, T1>(array: T[], predicate: (elem: T) => T1): T[] => {
            return (array || []).sort((a: T, b: T) => predicate(b) < predicate(a) ? -1 : 1)
        }
    },
    Object: {
        /**
         * Проверяет, содержит ли объект obj хотя бы один элемент, удовлетворяющий условию, заданному в predicate
         */
        Any: (obj: { [key: string]: any }, predicate: (val: any, key?: string, obj?: { [key: string]: any }) => boolean): boolean => {
            if (!Utils.IsObject(obj))
                return false;
            for (let key in obj) {
                if (predicate(obj[key], key, obj))
                    return true;
            }
            return false;
        },
        /**
         * Проверяет, соответствуют ли все свойства объекта условию, заданному в predicate
         */
        All: (obj: { [key: string]: any }, predicate: (val: any, key?: string, obj?: { [key: string]: any }) => boolean): boolean => {
            if (!Utils.IsObject(obj))
                return false;
            for (let key in obj) {
                if (!predicate(obj[key], key, obj))
                    return false;
            }
            return true;
        },
        /**
         * Перебор по полям объекта
         */
        ForEach: (obj: { [key: string]: any }, predicate: (val: any, key?: string, obj?: { [key: string]: any }) => void): void => {
            if (!Utils.IsObject(obj))
                return;
            for (let key in obj) {
                predicate(obj[key], key, obj);
            }
        },
        /**
         * Расширяет исходный объект obj объектами source
         * при совпадении названий полей в исходном объекте перезаписываются из source
         */
        Extend: <T extends { [key: string]: any }, T1 extends { [key: string]: any }>(obj: T, ...source: { [key: string]: any }[]): T1 => {
            if (!Utils.IsObject(obj) || !Utils.Array.Any(source, (el) => Utils.IsObject(el)))
                return null;
            return <T1>Object.assign(obj, ...source);
        },
        /**
         * Возвращает массив ключей объекта
         */
        Keys: <T extends { [key: string]: any }>(obj: T): string[] => {
            let rval: string[] = [];
            Utils.Object.ForEach(obj, (val, key) => {
                rval.push(key);
            });
            return rval;
        }
    },
    Dom: {
        /**
         * Определяет, содержится ли DOM-элемент element в container
         * @param element искомый элемент
         * @param container родительский DOM-элемент, если не указан, то проверяется, содержится ли элемент на странице
         */
        Contains(element: Node, container: Node = document): boolean {
            return element === container || !Utils.IsNullOrUndefined(element.parentNode) && Utils.Dom.Contains(element.parentNode, container);
        }
    },
  
    Url: {
        /**
         * Подставляет параметры из params в url_template
         * @param url_template должен быть вида "url/path/:param"
         */
        SetParams: (url_template: string, params: { [key: string]: string | number | boolean }): string => {
            return url_template.replace(/\/\:[^/]+/g, (substr: string) => '/' + params[substr.substr(2)]);
        },
        /**
         * Извлекает из url_template параметры для подстановки
         * @param url_template должен быть вида "url/path/:param"
         */
        ExtractParams: (url_template: string): string[] => {
            return Utils.Array.Map(url_template.match(/\/\:[^/]+/g), (str) => str.substr(2));
        }
    },
}
 window['Utils'] = Utils;