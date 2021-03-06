/**
 * _y.js：github.com/triumphalism/fn.git
 * (c) 2015-2016 Red <wanghongxin@outlook.com><QQ:2262118088>
 * MIT
 * 加油啊，Red!
 * thanks Michael Fogus!
 * done:惰性链/管道/类/继承/掺和/类型判断/柯里化/反柯里化
 */
;void function(name,factory, root) {
    var hasDefine=typeof define==='function';
    var hasExports=typeof module==='object'&&module!=null&&typeof module.exports==='object';
    if(hasExports){
        module.exports=factory();
    }else if(hasDefine){
        if(define.amd){
            define(name,[],factory);
        }
    }else{
        root[name] = factory();
    }
}('_y',function() {
    // 'use strict'
    //native code
    var root = typeof self==='object'&&self.self===self&&self||
               typeof global==='object' && global.global===global&&global||
               this;//underscore do so;
    var Array = root.Array;
    var Object = root.Object;
    var Function = root.Function;
    var FuncProto=Function.prototype;
    var ObjProto = Object.prototype;
    var ArrayProto = Array.prototype;
    var _push_=ArrayProto.push;
    var _shift_=ArrayProto.shift;
    var _unshift_=ArrayProto.unshift;
    var _splice_=ArrayProto.splice;
    var _pop_=ArrayProto.pop;
    var _slice_ = ArrayProto.slice;
    var _toString_ = ObjProto.toString;
    var _Promise_ = root.Promise;
    var _map_ = ArrayProto.map;
    var _reduce_ = ArrayProto.reduce;
    var _reduceRight_ = ArrayProto.reduceRight;
    var _forEach_ = ArrayProto.forEach;
    var _filter_ = ArrayProto.filter;
    var _some = ArrayProto.some;
    var _every = ArrayProto.every;
    var _has_ = ObjProto.hasOwnProperty;
    var _call_ = FuncProto.call;
    var _aplly_= FuncProto.apply;
    var _bind_= FuncProto.bind;

    //uncurrying
    //
    // var toArray=curry2(slice)(0);
    var call=uncurrying(_call_);
    var apply=uncurrying(_aplly_);
    var bind=dispatch(invoker('bind',_bind_),_bind);//兼容es<5
    var slice=dispatch(invoker('slice',_slice_),always([]));//兼容undefined and null
    var toString=uncurrying(_toString_);//调用者保证前置条件，函数本身没有这个职责;
    var push=uncurrying(_push_);
    var shift=uncurrying(_shift_);
    var splice=uncurrying(_splice_);
    var unshift=uncurrying(_unshift_);
    var pop=uncurrying(_pop_);

    // function _slice(arrayLike){return existy(arrayLike)?apply(_slice_,arrayLike,rest(arguments)):[];}

    var _Promise=createClass({},function(async,defferd){
        defferd=defferd instanceof  Defferd?((defferd.promise=this),defferd):new Defferd(this);
        if(isFunction(async)) async(partial1(defferd.resolve,defferd),partial1(defferd.reject,defferd));
        this.then=function(onFulfilled,onRejected,onProgress){
            if(isFunction(onFulfilled)) defferd.once('success',onFullfilled);
            if(isFunction(onRejected)) defferd.once('success',onRejected);
            if(isFunction(onProgress)) defferd.once('success',onProgress);
            return new _Promise;
        };
    });


    var Event=createClass({});//to continue

    var Defferd=Event.extend({
        resolve:function(obj){
            this.state='fulfilled';
            this.trigger('success',obj);
        },
        reject:function(error){
            this.state='rejected';
            this.trigger('error',error);
        },
        progress:function(chunck){
            this.trigger('progress',chunck);
        }
    },function(promise){
        this.state='pending';
        this.promise=promise instanceof _Promise?promise:new _Promise(null,this);
    });

    //isType
    var falsey = not(truthy);
    var nothingify = not(existy);
    var isFunction = isType('Function');
    var isArray = Array.isArray || isType('Array');
    var isString = isType('String');
    var isNumber = isType('Number');

    //closure and combinor
    var map = dispatch(invoker('map', _map_), _map);
    var reduce = dispatch(invoker('reduce', _reduce_), _reduce);
    var reduceRight = dispatch(invoker('reduceRight', _reduceRight_), _reduceRight);
    var each = dispatch(forEach, _forEach);
    var filter = dispatch(invoker('filter', _filter_), _filter);
    var some = dispatch(invoker('some', _some), _some);
    var every = dispatch(invoker('every', _every), _every);
    var Promise = dispatch(_Promise_, _Promise);
    //two underscore means native code,one underscore means poly;
    function fail(thing) {throw new Error(thing);}

    function warn() {console.info(['WARNING:', thing].join(' '));}

    function note() {console.log(['NOTE:', thing].join(' '));}

    function has(obj, key) {return call(_has_,obj, key);}

    function existy(x) {return x != null;}

    function truthy(x) {return existy(x) && x !== false;}

    function toArray(x) {return existy(x) ? call(_slice_,x) : [];}

    function first(x) {return nth(x, 0);}

    function second(x) {return nth(x, 1);}

    function iterateUntil(fn,check,seed){
        var value=fn(seed);
        var ret=[];
        ret.push(value);

        while(check(value)){
            value=fn(value);
            ret.push(value);
        }
        return ret;
    }

    function curry1(fn) {
        return function(arg1) {
            return call(fn,null,arg1);
        }
    }

    function curry2(fn){
        return function(arg2){
            return function(arg1){
                return call(fn,null,arg1,arg2);
            }
        }
    }

    function partial1(fn) {
        var args = _.rest(arguments);
        return function() {
                return apply(fn,null, cat(args, arguments));
        }
    }

    function rest(x) {return call(_slice_,toArray(x),1);}

    function nth(x, key) {return isIndexed(x) ? x[key] : undefined;}

    function not(fn) {
        return function() {
            var args = toArray(arguments);
            return !apply(fn,null, args);
        };
    }

    function cat() {
        var args = toArray(arguments);
        var head = first(args);
        if (isArray(head))
            return apply(head.concat,head, rest(args));
        else
            return [];
    }

    function construct(head, tail) {return cat([head], toArray(tail));}

    function _map(target, iterator, context) {
        var result = [];
        target = toArray(target);
        for (var i = 0, l = target.length; i < l; ++i) {
            result[result.length] = call(iterator,context, target[i], i, target);
        }
        return result;
    }

    function _reduce(array, cb, seed, context) {
        array = toArray(array);
        if (!isFunction(cb)) {
            return array[array.length - 1];
        }
        if (!existy(seed)) {
            seed = array.shift();
        }
        for (var i = 0, l = array.length; i < l; ++i) {
            seed = call(cb,context, seed, array[i], i, array)
        }
        return seed;
    }

    function _reduceRight(array, cb, seed, context) {
        array = toArray(array);
        if (!isFunction(cb)) {
            return array[array.length - 1];
        }
        if (!existy(seed)) {
            seed = array.shift();
        }
        var l = array.length;
        while (l--) {
            seed = call(cb,context, seed, array[i], i, array)
        }

        return seed;
    }

    function _filter(array, fn) {
        var ret = [];
        var l = array.length;
        var i = 0;
        while (i < l) {
            if (fn(array[i], i, array)) {
                ret.push(array[i]);
            }
            i++;
        }
        return ret;
    }

    function _some(array, fn) {
        var l = array.length;
        var i = 0;
        while (i < l) {
            if (fn(array[i], i, array)) {
                return true;
            }
            i++;
        }
        return false;
    }

    function _every(array, fn) {
        var l = array.length;
        var i = 0;
        while (i < l) {
            if (!fn(array[i], i, array)) {
                return false;
            }
            i++;
        }
        return true;
    }

    function isIndexed(x) {return isArray(x) || isString(x);}

    function isType(x) {
        return function(y) {
            return toString(y) == '[object ' + x + ']';
        }
    }

    function when(cond) {
        var value;
        var done = truthy(cond);
        var fail = falsey(cond);
        var then = function(fn) {
            if (done) value = isFunction(fn) ? fn(value) : fn;
            return then;
        };
        var otherwise = function(fn) {
            if (fail) value = isFunction(fn) ? fn(value) : fn;
            return otherwise;
        };
        then.value = otherwise.value = function() {
            return value;
        };
        then.then = otherwise.then = then;
        otherwise.otherwise = then.otherwise = otherwise;
        return then;
    }

    function always(x) {
        return function() {
            return x
        }
    }

    function identity(x) {return x;}

    function dispatch() {
        var args = toArray(arguments);
        return function() {
            var ret;
            for (var i = 0, l = args.length; i < l; ++i) {
                ret = isFunction(args[i]) ? apply(args[i],null, toArray(arguments)) : null;
                if (existy(ret)) return ret;
            }
            return ret;
        };
    }

    function pluck(key) {
        return function(target) {
            return target ? target[key] : undefined;
        }
    }

    function fnull(fn) {
        var defaults = rest(fn);
        return function() {
            var args = toArray(arguments);
            var l = args.length;
            while (l--) {
                if (existy(args[l])) args[l] = defaults[l];
            }
            return apply(fn,null, args);
        }
    }

    function invoker(key, method) {//uncurrying ,but 添加了对数据类型的校验，而uncurrying奉行的是鸭子类型思想。
        return function(target) {
            if (existy(target) && isFunction(target[key]) && target[key] === method) return apply(method,target, rest(arguments));
            return;
        }
    }



    function uncurrying(method){
        return function(){
            return _call_.apply(method,arguments);
        }
    }
    // function uncurrying(method){//why maxium call size?
    //     return function(host){
    //         return method.apply(host,rest(arguments))
    //     }
    // }

    function validator(fn, error, failure) {
        var wapper = function(x) {
            return isFunction(fn) ? fn(x) : undefined;
        };
        wapper.failure = failure;
        wapper.error = error;
        return wapper;
    }

    function checkor(validators) {
        var validators = toArray(arguments);
        return function() {
            var args = toArray(arguments);
            return reduce(validators, function(seed, validator) {
                var result = (apply(validator,null, args) === validator.failure) ? [validator.error] : [];
                return cat(seed, result);
            }, []);
        }
    }

    function aliasFor(obj) {
        var alias = function(oldname) {
            function fn(newname) {
                obj[newname] = obj[oldname];
                return fn;
            }
            return fn.is = fn.are = fn.and = fn;
        };
        return alias.alias = alias;
    }

    function forEach() {
        var head = first(arguments);
        if (existy(head) && head.forEach && head.forEach === __each) {
            apply(invoker('forEach', _forEach_),null, arguments);
            return head;
        } else {
            return;
        }
    }

    function _forEach(array, cb, context) {
        array = toArray(array);
        if (!isFunction(cb)) return array;
        for (var i = 0, l = array.length; i < l; ++i) {
            call(cb,context, array[i], i, array)
        }
        return array;
    }

    // function mixin(target, resource) {
    //     for (var i in resource) {
    //         if (has(resource, i)) {
    //             target[i] = resource[i];
    //         }
    //     }
    // }

    function parent(prototype) { //父类的实例存放实例初始化和class初始化属性
        for (var i in prototype) {
            if (has(prototype,i)) {
                this[i] = prototype[i];
            }
        }
    };

    function plain() {}

    function createClass(prototype, __initIns, __initClass) {

        __initIns = __initIns || plain;
        __initClass = __initClass || plain;
        var parentProto = {
            __initIns__: __initIns,
            __initClass__: __initClass
        };
        parent.prototype = parentProto;
        var f = function() {
            if(!(this instanceof f)){
                plain.prototype=fProto;
                return apply(f,new plain,arguments);
            }
            apply(this.__initIns__,this, arguments);
            this.initialize && apply(this.initialize,this, arguments);
            return this;
        };

        f.__initClass__ = __initClass;
        __initClass(f);
        f.__initIns__ = __initIns;
        f.extend = extend;

        var fProto = new parent(prototype);
        fProto.constructor = f;
        f.prototype = fProto;
        return f;
    }

    function extendClass(seed, another, initialize) {
        var child = function() {
            apply(another,this, arguments);
            initialize && apply(initialize,this, arguments);
        };
        plain.prototype = another.prototype;

        var proto = new plain;
        plain.prototype = proto;
        proto = new plain;
        child.prototype = proto;
        mixin(proto, seed);
        return child;
    }

    function mixin(des, src) {
        var args=toArray(arguments);
        var i=0;
        var l=args.length;
        while(++i<l){
            var next=args[i];
            for (var j in next) {
                if (has(next,j)) {
                    des[j] = next[j];
                }
            }
        }
        return des;
    }

    function merge(des,src){
        return apply(mixin,null,construct({},toArray(arguments)));
    }
    var Chain=createClass({
        invoke:function(){
            var args=toArray(arguments);
            this._calls.push(function(value){
                return apply(value[args[0]],value,slice(args,1));
            });
            return this;
        },
        value:function(){
            return reduce(this._calls,function(product,current){
                return current(product);
            },this._value);
        }
    },function(value){
        var isChain=value instanceof Chain;
        this._value=isChain?value._value:value;
        this._calls=isChain?value._calls:[];
        return this;
    });

    function extend(seed, initialize) {return extendClass(seed, this, initialize);}
    
    function pipe(){
        var args=toArray(arguments);
        return function(){
            var seed=apply(first(args),null,toArray(arguments));
            return reduce(slice(args,1),function(product,current){
                return call(current,null,product);
            },seed);
        }
    }

    function partial(fn,length,args,holes){
        // var boundArgs=slice(arguments,1);
        length=length||fn.length;
        args=args||[];
        holes=holes||[];
        return function(){
            var _args=toArray(args);
            var _holes=toArray(holes);
            var holeStart=_holes.length;
            var argStart=_args.length;
            var arg;
            for(var i=0,l=arguments.length;i<l;++i){
                arg=arguments[i];
                if(arg===y&&holeStart){
                    push(_holes,shift(_holes));
                }else if(arg===y){
                    push(holes,holeStart+i);
                }else if(holeStart){
                    holeStart--;
                    splice(_args,shift(_holes),0,arg);
                }else{
                    push(_args,arg);
                }
            }
            if(_args.length<length){
                return call(partial,null,fn,length,_args,_holes);
            }else{
                return apply(fn,null,_args);
            }
        };  
    }

    function _bind(fn,context){
        var boundArgs=slice(arguments,2);
        return function(){
            return apply(fn,context,cat(boundArgs,arguments));
        };
    }

    function lift(answerFn,stateFn){
        return function(state){
            var answer=answerFn(state);
            var state=stateFn?stateFn(state):answer;
            return {answer:answer,state:state};
        }
    }

    function actions(){
        var acts=toArray(arguments);
        var done= function(done){
            var load=function(seed){
                var init={values:[],state:seed};
                var lastResult=reduce(acts,function(product,act){
                    var result=act(product.state);
                    var values=cat(product.values,result.answer);
                    return {values:values,state:result.state};
                },init);
                var keep=filter(lastResult.values,existy);
                return done(keep,lastResult.state);
            }
            return load.load=load;
        }
        return done.done=done;
    }
    //member table
    var _hash = {//62
        existy: existy,
        truthy: truthy,
        falsey: falsey,
        nothingify: nothingify,
        not: not,
        fail: fail,
        warn: warn,
        note: note,
        isFunction: isFunction,
        isArray: isArray,
        isString: isString,
        isNumber: isNumber,
        isIndexed: isIndexed,
        has: has,
        bind:bind,
        call:call,
        apply:apply,
        uncurrying:uncurrying,
        curry1: curry1,
        curry2:curry2,
        partial1: partial1,
        partial:partial,
        iterateUntil:iterateUntil,
        toArray: toArray,
        slice:slice,
        shift:shift,
        splice:splice,
        pop:pop,
        push:push,
        unshift:unshift,
        map: map,
        reduce: reduce,
        reduceRight: reduceRight,
        each: each,
        filter: filter,
        every: every,
        some: some,
        cat: cat,
        construct: construct,
        nth: nth,
        first: first,
        rest: rest,
        second: second,
        pipe:pipe,
        Chain:Chain,
        validator: validator,
        dispatch: dispatch,
        lift:lift,
        actions:actions,
        checkor: checkor,
        invoker: invoker,
        pluck: pluck,
        fnull: fnull,
        when: when,
        always: always,
        identity: identity,
        aliasFor: aliasFor,
        mixin: mixin,
        merge:merge,
        createClass:createClass,
        extendClass:extendClass,
        Promise:Promise
    };

    //namespace and constuctor
    function y() {};

    mixin(y, _hash);

    //member alias
    var aliasFor_y = _hash.aliasFor(y);


    aliasFor_y.alias('reduce')
                   .is('reduceLeft')
                   .and('fold')
                   .are('foldLeft');

    aliasFor_y.alias('each')
                   .is('forEach');

    aliasFor_y.alias('reduceRight')
                   .is('foldRight');

    aliasFor_y.alias('createClass')
                 .is('inherit');
    aliasFor_y.alias('always')
                   .is('k');

    return y;
}, this);
