let wasm;

function isLikeNone(x) {
    return x === undefined || x === null;
}

function addToExternrefTable0(obj) {
    const idx = wasm.__externref_table_alloc();
    wasm.__wbindgen_export_1.set(idx, obj);
    return idx;
}

const cachedTextDecoder = (typeof TextDecoder !== 'undefined' ? new TextDecoder('utf-8', { ignoreBOM: true, fatal: true }) : { decode: () => { throw Error('TextDecoder not available') } } );

if (typeof TextDecoder !== 'undefined') { cachedTextDecoder.decode(); };

let cachedUint8ArrayMemory0 = null;

function getUint8ArrayMemory0() {
    if (cachedUint8ArrayMemory0 === null || cachedUint8ArrayMemory0.byteLength === 0) {
        cachedUint8ArrayMemory0 = new Uint8Array(wasm.memory.buffer);
    }
    return cachedUint8ArrayMemory0;
}

function getStringFromWasm0(ptr, len) {
    ptr = ptr >>> 0;
    return cachedTextDecoder.decode(getUint8ArrayMemory0().subarray(ptr, ptr + len));
}

function handleError(f, args) {
    try {
        return f.apply(this, args);
    } catch (e) {
        const idx = addToExternrefTable0(e);
        wasm.__wbindgen_exn_store(idx);
    }
}

let WASM_VECTOR_LEN = 0;

const cachedTextEncoder = (typeof TextEncoder !== 'undefined' ? new TextEncoder('utf-8') : { encode: () => { throw Error('TextEncoder not available') } } );

const encodeString = (typeof cachedTextEncoder.encodeInto === 'function'
    ? function (arg, view) {
    return cachedTextEncoder.encodeInto(arg, view);
}
    : function (arg, view) {
    const buf = cachedTextEncoder.encode(arg);
    view.set(buf);
    return {
        read: arg.length,
        written: buf.length
    };
});

function passStringToWasm0(arg, malloc, realloc) {

    if (realloc === undefined) {
        const buf = cachedTextEncoder.encode(arg);
        const ptr = malloc(buf.length, 1) >>> 0;
        getUint8ArrayMemory0().subarray(ptr, ptr + buf.length).set(buf);
        WASM_VECTOR_LEN = buf.length;
        return ptr;
    }

    let len = arg.length;
    let ptr = malloc(len, 1) >>> 0;

    const mem = getUint8ArrayMemory0();

    let offset = 0;

    for (; offset < len; offset++) {
        const code = arg.charCodeAt(offset);
        if (code > 0x7F) break;
        mem[ptr + offset] = code;
    }

    if (offset !== len) {
        if (offset !== 0) {
            arg = arg.slice(offset);
        }
        ptr = realloc(ptr, len, len = offset + arg.length * 3, 1) >>> 0;
        const view = getUint8ArrayMemory0().subarray(ptr + offset, ptr + len);
        const ret = encodeString(arg, view);

        offset += ret.written;
        ptr = realloc(ptr, len, offset, 1) >>> 0;
    }

    WASM_VECTOR_LEN = offset;
    return ptr;
}

let cachedDataViewMemory0 = null;

function getDataViewMemory0() {
    if (cachedDataViewMemory0 === null || cachedDataViewMemory0.buffer.detached === true || (cachedDataViewMemory0.buffer.detached === undefined && cachedDataViewMemory0.buffer !== wasm.memory.buffer)) {
        cachedDataViewMemory0 = new DataView(wasm.memory.buffer);
    }
    return cachedDataViewMemory0;
}

let cachedUint32ArrayMemory0 = null;

function getUint32ArrayMemory0() {
    if (cachedUint32ArrayMemory0 === null || cachedUint32ArrayMemory0.byteLength === 0) {
        cachedUint32ArrayMemory0 = new Uint32Array(wasm.memory.buffer);
    }
    return cachedUint32ArrayMemory0;
}

function getArrayU32FromWasm0(ptr, len) {
    ptr = ptr >>> 0;
    return getUint32ArrayMemory0().subarray(ptr / 4, ptr / 4 + len);
}

const CLOSURE_DTORS = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(state => {
    wasm.__wbindgen_export_6.get(state.dtor)(state.a, state.b)
});

function makeMutClosure(arg0, arg1, dtor, f) {
    const state = { a: arg0, b: arg1, cnt: 1, dtor };
    const real = (...args) => {
        // First up with a closure we increment the internal reference
        // count. This ensures that the Rust closure environment won't
        // be deallocated while we're invoking it.
        state.cnt++;
        const a = state.a;
        state.a = 0;
        try {
            return f(a, state.b, ...args);
        } finally {
            if (--state.cnt === 0) {
                wasm.__wbindgen_export_6.get(state.dtor)(a, state.b);
                CLOSURE_DTORS.unregister(state);
            } else {
                state.a = a;
            }
        }
    };
    real.original = state;
    CLOSURE_DTORS.register(real, state, state);
    return real;
}

function debugString(val) {
    // primitive types
    const type = typeof val;
    if (type == 'number' || type == 'boolean' || val == null) {
        return  `${val}`;
    }
    if (type == 'string') {
        return `"${val}"`;
    }
    if (type == 'symbol') {
        const description = val.description;
        if (description == null) {
            return 'Symbol';
        } else {
            return `Symbol(${description})`;
        }
    }
    if (type == 'function') {
        const name = val.name;
        if (typeof name == 'string' && name.length > 0) {
            return `Function(${name})`;
        } else {
            return 'Function';
        }
    }
    // objects
    if (Array.isArray(val)) {
        const length = val.length;
        let debug = '[';
        if (length > 0) {
            debug += debugString(val[0]);
        }
        for(let i = 1; i < length; i++) {
            debug += ', ' + debugString(val[i]);
        }
        debug += ']';
        return debug;
    }
    // Test for built-in
    const builtInMatches = /\[object ([^\]]+)\]/.exec(toString.call(val));
    let className;
    if (builtInMatches && builtInMatches.length > 1) {
        className = builtInMatches[1];
    } else {
        // Failed to match the standard '[object ClassName]'
        return toString.call(val);
    }
    if (className == 'Object') {
        // we're a user defined class or Object
        // JSON.stringify avoids problems with cycles, and is generally much
        // easier than looping through ownProperties of `val`.
        try {
            return 'Object(' + JSON.stringify(val) + ')';
        } catch (_) {
            return 'Object';
        }
    }
    // errors
    if (val instanceof Error) {
        return `${val.name}: ${val.message}\n${val.stack}`;
    }
    // TODO we could test for more things here, like `Set`s and `Map`s.
    return className;
}

function takeFromExternrefTable0(idx) {
    const value = wasm.__wbindgen_export_1.get(idx);
    wasm.__externref_table_dealloc(idx);
    return value;
}
function __wbg_adapter_34(arg0, arg1) {
    const ret = wasm._dyn_core__ops__function__FnMut_____Output___R_as_wasm_bindgen__closure__WasmClosure___describe__invoke__h3e05284919fe4a3f_multivalue_shim(arg0, arg1);
    if (ret[1]) {
        throw takeFromExternrefTable0(ret[0]);
    }
}

function __wbg_adapter_37(arg0, arg1, arg2) {
    wasm.closure183_externref_shim(arg0, arg1, arg2);
}

function __wbg_adapter_40(arg0, arg1, arg2) {
    wasm.closure185_externref_shim(arg0, arg1, arg2);
}

function __wbg_adapter_43(arg0, arg1, arg2) {
    wasm.closure425_externref_shim(arg0, arg1, arg2);
}

function __wbg_adapter_46(arg0, arg1, arg2) {
    wasm.closure428_externref_shim(arg0, arg1, arg2);
}

const __wbindgen_enum_GpuAddressMode = ["clamp-to-edge", "repeat", "mirror-repeat"];

const __wbindgen_enum_GpuBlendFactor = ["zero", "one", "src", "one-minus-src", "src-alpha", "one-minus-src-alpha", "dst", "one-minus-dst", "dst-alpha", "one-minus-dst-alpha", "src-alpha-saturated", "constant", "one-minus-constant", "src1", "one-minus-src1", "src1-alpha", "one-minus-src1-alpha"];

const __wbindgen_enum_GpuBlendOperation = ["add", "subtract", "reverse-subtract", "min", "max"];

const __wbindgen_enum_GpuBufferBindingType = ["uniform", "storage", "read-only-storage"];

const __wbindgen_enum_GpuCompareFunction = ["never", "less", "equal", "less-equal", "greater", "not-equal", "greater-equal", "always"];

const __wbindgen_enum_GpuCullMode = ["none", "front", "back"];

const __wbindgen_enum_GpuDeviceLostReason = ["unknown", "destroyed"];

const __wbindgen_enum_GpuErrorFilter = ["validation", "out-of-memory", "internal"];

const __wbindgen_enum_GpuFilterMode = ["nearest", "linear"];

const __wbindgen_enum_GpuFrontFace = ["ccw", "cw"];

const __wbindgen_enum_GpuIndexFormat = ["uint16", "uint32"];

const __wbindgen_enum_GpuMipmapFilterMode = ["nearest", "linear"];

const __wbindgen_enum_GpuPrimitiveTopology = ["point-list", "line-list", "line-strip", "triangle-list", "triangle-strip"];

const __wbindgen_enum_GpuQueryType = ["occlusion", "timestamp"];

const __wbindgen_enum_GpuSamplerBindingType = ["filtering", "non-filtering", "comparison"];

const __wbindgen_enum_GpuStencilOperation = ["keep", "zero", "replace", "invert", "increment-clamp", "decrement-clamp", "increment-wrap", "decrement-wrap"];

const __wbindgen_enum_GpuStorageTextureAccess = ["write-only", "read-only", "read-write"];

const __wbindgen_enum_GpuTextureAspect = ["all", "stencil-only", "depth-only"];

const __wbindgen_enum_GpuTextureDimension = ["1d", "2d", "3d"];

const __wbindgen_enum_GpuTextureFormat = ["r8unorm", "r8snorm", "r8uint", "r8sint", "r16uint", "r16sint", "r16float", "rg8unorm", "rg8snorm", "rg8uint", "rg8sint", "r32uint", "r32sint", "r32float", "rg16uint", "rg16sint", "rg16float", "rgba8unorm", "rgba8unorm-srgb", "rgba8snorm", "rgba8uint", "rgba8sint", "bgra8unorm", "bgra8unorm-srgb", "rgb9e5ufloat", "rgb10a2uint", "rgb10a2unorm", "rg11b10ufloat", "rg32uint", "rg32sint", "rg32float", "rgba16uint", "rgba16sint", "rgba16float", "rgba32uint", "rgba32sint", "rgba32float", "stencil8", "depth16unorm", "depth24plus", "depth24plus-stencil8", "depth32float", "depth32float-stencil8", "bc1-rgba-unorm", "bc1-rgba-unorm-srgb", "bc2-rgba-unorm", "bc2-rgba-unorm-srgb", "bc3-rgba-unorm", "bc3-rgba-unorm-srgb", "bc4-r-unorm", "bc4-r-snorm", "bc5-rg-unorm", "bc5-rg-snorm", "bc6h-rgb-ufloat", "bc6h-rgb-float", "bc7-rgba-unorm", "bc7-rgba-unorm-srgb", "etc2-rgb8unorm", "etc2-rgb8unorm-srgb", "etc2-rgb8a1unorm", "etc2-rgb8a1unorm-srgb", "etc2-rgba8unorm", "etc2-rgba8unorm-srgb", "eac-r11unorm", "eac-r11snorm", "eac-rg11unorm", "eac-rg11snorm", "astc-4x4-unorm", "astc-4x4-unorm-srgb", "astc-5x4-unorm", "astc-5x4-unorm-srgb", "astc-5x5-unorm", "astc-5x5-unorm-srgb", "astc-6x5-unorm", "astc-6x5-unorm-srgb", "astc-6x6-unorm", "astc-6x6-unorm-srgb", "astc-8x5-unorm", "astc-8x5-unorm-srgb", "astc-8x6-unorm", "astc-8x6-unorm-srgb", "astc-8x8-unorm", "astc-8x8-unorm-srgb", "astc-10x5-unorm", "astc-10x5-unorm-srgb", "astc-10x6-unorm", "astc-10x6-unorm-srgb", "astc-10x8-unorm", "astc-10x8-unorm-srgb", "astc-10x10-unorm", "astc-10x10-unorm-srgb", "astc-12x10-unorm", "astc-12x10-unorm-srgb", "astc-12x12-unorm", "astc-12x12-unorm-srgb"];

const __wbindgen_enum_GpuTextureSampleType = ["float", "unfilterable-float", "depth", "sint", "uint"];

const __wbindgen_enum_GpuTextureViewDimension = ["1d", "2d", "2d-array", "cube", "cube-array", "3d"];

const __wbindgen_enum_GpuVertexFormat = ["uint8", "uint8x2", "uint8x4", "sint8", "sint8x2", "sint8x4", "unorm8", "unorm8x2", "unorm8x4", "snorm8", "snorm8x2", "snorm8x4", "uint16", "uint16x2", "uint16x4", "sint16", "sint16x2", "sint16x4", "unorm16", "unorm16x2", "unorm16x4", "snorm16", "snorm16x2", "snorm16x4", "float16", "float16x2", "float16x4", "float32", "float32x2", "float32x3", "float32x4", "uint32", "uint32x2", "uint32x3", "uint32x4", "sint32", "sint32x2", "sint32x3", "sint32x4", "unorm10-10-10-2", "unorm8x4-bgra"];

const __wbindgen_enum_GpuVertexStepMode = ["vertex", "instance"];

const __wbindgen_enum_ResizeObserverBoxOptions = ["border-box", "content-box", "device-pixel-content-box"];

async function __wbg_load(module, imports) {
    if (typeof Response === 'function' && module instanceof Response) {
        if (typeof WebAssembly.instantiateStreaming === 'function') {
            try {
                return await WebAssembly.instantiateStreaming(module, imports);

            } catch (e) {
                if (module.headers.get('Content-Type') != 'application/wasm') {
                    console.warn("`WebAssembly.instantiateStreaming` failed because your server does not serve Wasm with `application/wasm` MIME type. Falling back to `WebAssembly.instantiate` which is slower. Original error:\n", e);

                } else {
                    throw e;
                }
            }
        }

        const bytes = await module.arrayBuffer();
        return await WebAssembly.instantiate(bytes, imports);

    } else {
        const instance = await WebAssembly.instantiate(module, imports);

        if (instance instanceof WebAssembly.Instance) {
            return { instance, module };

        } else {
            return instance;
        }
    }
}

function __wbg_get_imports() {
    const imports = {};
    imports.wbg = {};
    imports.wbg.__wbg_activeElement_367599fdfa7ad115 = function(arg0) {
        const ret = arg0.activeElement;
        return isLikeNone(ret) ? 0 : addToExternrefTable0(ret);
    };
    imports.wbg.__wbg_activeTexture_0f19d8acfa0a14c2 = function(arg0, arg1) {
        arg0.activeTexture(arg1 >>> 0);
    };
    imports.wbg.__wbg_activeTexture_460f2e367e813fb0 = function(arg0, arg1) {
        arg0.activeTexture(arg1 >>> 0);
    };
    imports.wbg.__wbg_addEventListener_84ae3eac6e15480a = function() { return handleError(function (arg0, arg1, arg2, arg3, arg4) {
        arg0.addEventListener(getStringFromWasm0(arg1, arg2), arg3, arg4);
    }, arguments) };
    imports.wbg.__wbg_altKey_c33c03aed82e4275 = function(arg0) {
        const ret = arg0.altKey;
        return ret;
    };
    imports.wbg.__wbg_altKey_d7495666df921121 = function(arg0) {
        const ret = arg0.altKey;
        return ret;
    };
    imports.wbg.__wbg_appendChild_8204974b7328bf98 = function() { return handleError(function (arg0, arg1) {
        const ret = arg0.appendChild(arg1);
        return ret;
    }, arguments) };
    imports.wbg.__wbg_arrayBuffer_f18c144cd0125f07 = function(arg0) {
        const ret = arg0.arrayBuffer();
        return ret;
    };
    imports.wbg.__wbg_at_7d852dd9f194d43e = function(arg0, arg1) {
        const ret = arg0.at(arg1);
        return ret;
    };
    imports.wbg.__wbg_attachShader_3d4eb6af9e3e7bd1 = function(arg0, arg1, arg2) {
        arg0.attachShader(arg1, arg2);
    };
    imports.wbg.__wbg_attachShader_94e758c8b5283eb2 = function(arg0, arg1, arg2) {
        arg0.attachShader(arg1, arg2);
    };
    imports.wbg.__wbg_bindBuffer_309c9a6c21826cf5 = function(arg0, arg1, arg2) {
        arg0.bindBuffer(arg1 >>> 0, arg2);
    };
    imports.wbg.__wbg_bindBuffer_f32f587f1c2962a7 = function(arg0, arg1, arg2) {
        arg0.bindBuffer(arg1 >>> 0, arg2);
    };
    imports.wbg.__wbg_bindTexture_a6e795697f49ebd1 = function(arg0, arg1, arg2) {
        arg0.bindTexture(arg1 >>> 0, arg2);
    };
    imports.wbg.__wbg_bindTexture_bc8eb316247f739d = function(arg0, arg1, arg2) {
        arg0.bindTexture(arg1 >>> 0, arg2);
    };
    imports.wbg.__wbg_bindVertexArrayOES_da8e7059b789629e = function(arg0, arg1) {
        arg0.bindVertexArrayOES(arg1);
    };
    imports.wbg.__wbg_bindVertexArray_6b4b88581064b71f = function(arg0, arg1) {
        arg0.bindVertexArray(arg1);
    };
    imports.wbg.__wbg_blendEquationSeparate_c1aa26a9a5c5267e = function(arg0, arg1, arg2) {
        arg0.blendEquationSeparate(arg1 >>> 0, arg2 >>> 0);
    };
    imports.wbg.__wbg_blendEquationSeparate_f3d422e981d86339 = function(arg0, arg1, arg2) {
        arg0.blendEquationSeparate(arg1 >>> 0, arg2 >>> 0);
    };
    imports.wbg.__wbg_blendFuncSeparate_483be8d4dd635340 = function(arg0, arg1, arg2, arg3, arg4) {
        arg0.blendFuncSeparate(arg1 >>> 0, arg2 >>> 0, arg3 >>> 0, arg4 >>> 0);
    };
    imports.wbg.__wbg_blendFuncSeparate_dafeabfc1680b2ee = function(arg0, arg1, arg2, arg3, arg4) {
        arg0.blendFuncSeparate(arg1 >>> 0, arg2 >>> 0, arg3 >>> 0, arg4 >>> 0);
    };
    imports.wbg.__wbg_blockSize_1490803190b57a34 = function(arg0) {
        const ret = arg0.blockSize;
        return ret;
    };
    imports.wbg.__wbg_blur_c2ad8cc71bac3974 = function() { return handleError(function (arg0) {
        arg0.blur();
    }, arguments) };
    imports.wbg.__wbg_body_942ea927546a04ba = function(arg0) {
        const ret = arg0.body;
        return isLikeNone(ret) ? 0 : addToExternrefTable0(ret);
    };
    imports.wbg.__wbg_bottom_79b03e9c3d6f4e1e = function(arg0) {
        const ret = arg0.bottom;
        return ret;
    };
    imports.wbg.__wbg_bufferData_3261d3e1dd6fc903 = function(arg0, arg1, arg2, arg3) {
        arg0.bufferData(arg1 >>> 0, arg2, arg3 >>> 0);
    };
    imports.wbg.__wbg_bufferData_33c59bf909ea6fd3 = function(arg0, arg1, arg2, arg3) {
        arg0.bufferData(arg1 >>> 0, arg2, arg3 >>> 0);
    };
    imports.wbg.__wbg_buffer_09165b52af8c5237 = function(arg0) {
        const ret = arg0.buffer;
        return ret;
    };
    imports.wbg.__wbg_buffer_609cc3eee51ed158 = function(arg0) {
        const ret = arg0.buffer;
        return ret;
    };
    imports.wbg.__wbg_button_f75c56aec440ea04 = function(arg0) {
        const ret = arg0.button;
        return ret;
    };
    imports.wbg.__wbg_call_672a4d21634d4a24 = function() { return handleError(function (arg0, arg1) {
        const ret = arg0.call(arg1);
        return ret;
    }, arguments) };
    imports.wbg.__wbg_cancelAnimationFrame_089b48301c362fde = function() { return handleError(function (arg0, arg1) {
        arg0.cancelAnimationFrame(arg1);
    }, arguments) };
    imports.wbg.__wbg_cancel_ec9f8196f0b0eb21 = function(arg0) {
        arg0.cancel();
    };
    imports.wbg.__wbg_changedTouches_3654bea4294f2e86 = function(arg0) {
        const ret = arg0.changedTouches;
        return ret;
    };
    imports.wbg.__wbg_clearColor_d39507085c98a678 = function(arg0, arg1, arg2, arg3, arg4) {
        arg0.clearColor(arg1, arg2, arg3, arg4);
    };
    imports.wbg.__wbg_clearColor_f0fa029dfbcc1982 = function(arg0, arg1, arg2, arg3, arg4) {
        arg0.clearColor(arg1, arg2, arg3, arg4);
    };
    imports.wbg.__wbg_clearInterval_ad2594253cc39c4b = function(arg0, arg1) {
        arg0.clearInterval(arg1);
    };
    imports.wbg.__wbg_clear_62b9037b892f6988 = function(arg0, arg1) {
        arg0.clear(arg1 >>> 0);
    };
    imports.wbg.__wbg_clear_f8d5f3c348d37d95 = function(arg0, arg1) {
        arg0.clear(arg1 >>> 0);
    };
    imports.wbg.__wbg_clientX_5eb380a5f1fec6fd = function(arg0) {
        const ret = arg0.clientX;
        return ret;
    };
    imports.wbg.__wbg_clientX_687c1a16e03e1f58 = function(arg0) {
        const ret = arg0.clientX;
        return ret;
    };
    imports.wbg.__wbg_clientY_78d0605ac74642c2 = function(arg0) {
        const ret = arg0.clientY;
        return ret;
    };
    imports.wbg.__wbg_clientY_d8b9c7f0c4e2e677 = function(arg0) {
        const ret = arg0.clientY;
        return ret;
    };
    imports.wbg.__wbg_clipboardData_04bd9c1b0935d7e6 = function(arg0) {
        const ret = arg0.clipboardData;
        return isLikeNone(ret) ? 0 : addToExternrefTable0(ret);
    };
    imports.wbg.__wbg_clipboard_93f8aa8cc426db44 = function(arg0) {
        const ret = arg0.clipboard;
        return ret;
    };
    imports.wbg.__wbg_colorMask_5e7c60b9c7a57a2e = function(arg0, arg1, arg2, arg3, arg4) {
        arg0.colorMask(arg1 !== 0, arg2 !== 0, arg3 !== 0, arg4 !== 0);
    };
    imports.wbg.__wbg_colorMask_6dac12039c7145ae = function(arg0, arg1, arg2, arg3, arg4) {
        arg0.colorMask(arg1 !== 0, arg2 !== 0, arg3 !== 0, arg4 !== 0);
    };
    imports.wbg.__wbg_compileShader_0ad770bbdbb9de21 = function(arg0, arg1) {
        arg0.compileShader(arg1);
    };
    imports.wbg.__wbg_compileShader_2307c9d370717dd5 = function(arg0, arg1) {
        arg0.compileShader(arg1);
    };
    imports.wbg.__wbg_contentBoxSize_638692469db816f2 = function(arg0) {
        const ret = arg0.contentBoxSize;
        return ret;
    };
    imports.wbg.__wbg_contentRect_81407eb60e52248f = function(arg0) {
        const ret = arg0.contentRect;
        return ret;
    };
    imports.wbg.__wbg_copyExternalImageToTexture_ec9f344769d4c65b = function() { return handleError(function (arg0, arg1, arg2, arg3) {
        arg0.copyExternalImageToTexture(arg1, arg2, arg3);
    }, arguments) };
    imports.wbg.__wbg_createBindGroupLayout_eb96dcf4a390d1a0 = function() { return handleError(function (arg0, arg1) {
        const ret = arg0.createBindGroupLayout(arg1);
        return ret;
    }, arguments) };
    imports.wbg.__wbg_createBindGroup_651605ed9d1deb6c = function(arg0, arg1) {
        const ret = arg0.createBindGroup(arg1);
        return ret;
    };
    imports.wbg.__wbg_createBuffer_11ec17c3871a5c94 = function() { return handleError(function (arg0, arg1) {
        const ret = arg0.createBuffer(arg1);
        return ret;
    }, arguments) };
    imports.wbg.__wbg_createBuffer_7a9ec3d654073660 = function(arg0) {
        const ret = arg0.createBuffer();
        return isLikeNone(ret) ? 0 : addToExternrefTable0(ret);
    };
    imports.wbg.__wbg_createBuffer_9886e84a67b68c89 = function(arg0) {
        const ret = arg0.createBuffer();
        return isLikeNone(ret) ? 0 : addToExternrefTable0(ret);
    };
    imports.wbg.__wbg_createCommandEncoder_298f58628bed8526 = function(arg0, arg1) {
        const ret = arg0.createCommandEncoder(arg1);
        return ret;
    };
    imports.wbg.__wbg_createComputePipeline_65265f6b613a4c23 = function(arg0, arg1) {
        const ret = arg0.createComputePipeline(arg1);
        return ret;
    };
    imports.wbg.__wbg_createElement_8c9931a732ee2fea = function() { return handleError(function (arg0, arg1, arg2) {
        const ret = arg0.createElement(getStringFromWasm0(arg1, arg2));
        return ret;
    }, arguments) };
    imports.wbg.__wbg_createPipelineLayout_8b9ead58c9b3792b = function(arg0, arg1) {
        const ret = arg0.createPipelineLayout(arg1);
        return ret;
    };
    imports.wbg.__wbg_createProgram_8ff56c485f3233d0 = function(arg0) {
        const ret = arg0.createProgram();
        return isLikeNone(ret) ? 0 : addToExternrefTable0(ret);
    };
    imports.wbg.__wbg_createProgram_da203074cafb1038 = function(arg0) {
        const ret = arg0.createProgram();
        return isLikeNone(ret) ? 0 : addToExternrefTable0(ret);
    };
    imports.wbg.__wbg_createQuerySet_876bbdbff75f15be = function() { return handleError(function (arg0, arg1) {
        const ret = arg0.createQuerySet(arg1);
        return ret;
    }, arguments) };
    imports.wbg.__wbg_createRenderBundleEncoder_a11df11bdb38aad5 = function() { return handleError(function (arg0, arg1) {
        const ret = arg0.createRenderBundleEncoder(arg1);
        return ret;
    }, arguments) };
    imports.wbg.__wbg_createRenderPipeline_6b7eede54a55b492 = function() { return handleError(function (arg0, arg1) {
        const ret = arg0.createRenderPipeline(arg1);
        return ret;
    }, arguments) };
    imports.wbg.__wbg_createSampler_f6efee5a19829e39 = function(arg0, arg1) {
        const ret = arg0.createSampler(arg1);
        return ret;
    };
    imports.wbg.__wbg_createShaderModule_847dec3b1b7916a6 = function(arg0, arg1) {
        const ret = arg0.createShaderModule(arg1);
        return ret;
    };
    imports.wbg.__wbg_createShader_4a256a8cc9c1ce4f = function(arg0, arg1) {
        const ret = arg0.createShader(arg1 >>> 0);
        return isLikeNone(ret) ? 0 : addToExternrefTable0(ret);
    };
    imports.wbg.__wbg_createShader_983150fb1243ee56 = function(arg0, arg1) {
        const ret = arg0.createShader(arg1 >>> 0);
        return isLikeNone(ret) ? 0 : addToExternrefTable0(ret);
    };
    imports.wbg.__wbg_createTexture_52a04b490df4ddad = function() { return handleError(function (arg0, arg1) {
        const ret = arg0.createTexture(arg1);
        return ret;
    }, arguments) };
    imports.wbg.__wbg_createTexture_9c536c79b635fdef = function(arg0) {
        const ret = arg0.createTexture();
        return isLikeNone(ret) ? 0 : addToExternrefTable0(ret);
    };
    imports.wbg.__wbg_createTexture_bfaa54c0cd22e367 = function(arg0) {
        const ret = arg0.createTexture();
        return isLikeNone(ret) ? 0 : addToExternrefTable0(ret);
    };
    imports.wbg.__wbg_createVertexArrayOES_991b44f100f93329 = function(arg0) {
        const ret = arg0.createVertexArrayOES();
        return isLikeNone(ret) ? 0 : addToExternrefTable0(ret);
    };
    imports.wbg.__wbg_createVertexArray_e435029ae2660efd = function(arg0) {
        const ret = arg0.createVertexArray();
        return isLikeNone(ret) ? 0 : addToExternrefTable0(ret);
    };
    imports.wbg.__wbg_ctrlKey_1e826e468105ac11 = function(arg0) {
        const ret = arg0.ctrlKey;
        return ret;
    };
    imports.wbg.__wbg_ctrlKey_cdbe8154dfb00d1f = function(arg0) {
        const ret = arg0.ctrlKey;
        return ret;
    };
    imports.wbg.__wbg_dataTransfer_86283b0702a1aff1 = function(arg0) {
        const ret = arg0.dataTransfer;
        return isLikeNone(ret) ? 0 : addToExternrefTable0(ret);
    };
    imports.wbg.__wbg_data_e77bd5c125ecc8a8 = function(arg0, arg1) {
        const ret = arg1.data;
        var ptr1 = isLikeNone(ret) ? 0 : passStringToWasm0(ret, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        var len1 = WASM_VECTOR_LEN;
        getDataViewMemory0().setInt32(arg0 + 4 * 1, len1, true);
        getDataViewMemory0().setInt32(arg0 + 4 * 0, ptr1, true);
    };
    imports.wbg.__wbg_debug_54de743626e56edc = function(arg0, arg1) {
        console.debug(getStringFromWasm0(arg0, arg1));
    };
    imports.wbg.__wbg_deleteBuffer_7ed96e1bf7c02e87 = function(arg0, arg1) {
        arg0.deleteBuffer(arg1);
    };
    imports.wbg.__wbg_deleteBuffer_a7822433fc95dfb8 = function(arg0, arg1) {
        arg0.deleteBuffer(arg1);
    };
    imports.wbg.__wbg_deleteProgram_3fa626bbc0001eb7 = function(arg0, arg1) {
        arg0.deleteProgram(arg1);
    };
    imports.wbg.__wbg_deleteProgram_71a133c6d053e272 = function(arg0, arg1) {
        arg0.deleteProgram(arg1);
    };
    imports.wbg.__wbg_deleteShader_8d42f169deda58ac = function(arg0, arg1) {
        arg0.deleteShader(arg1);
    };
    imports.wbg.__wbg_deleteShader_c65a44796c5004d8 = function(arg0, arg1) {
        arg0.deleteShader(arg1);
    };
    imports.wbg.__wbg_deleteTexture_a30f5ca0163c4110 = function(arg0, arg1) {
        arg0.deleteTexture(arg1);
    };
    imports.wbg.__wbg_deleteTexture_bb82c9fec34372ba = function(arg0, arg1) {
        arg0.deleteTexture(arg1);
    };
    imports.wbg.__wbg_deltaMode_9bfd9fe3f6b4b240 = function(arg0) {
        const ret = arg0.deltaMode;
        return ret;
    };
    imports.wbg.__wbg_deltaX_5c1121715746e4b7 = function(arg0) {
        const ret = arg0.deltaX;
        return ret;
    };
    imports.wbg.__wbg_deltaY_f9318542caea0c36 = function(arg0) {
        const ret = arg0.deltaY;
        return ret;
    };
    imports.wbg.__wbg_destroy_130951e77f87ecf3 = function(arg0) {
        arg0.destroy();
    };
    imports.wbg.__wbg_destroy_36b907c3e59a9a8c = function(arg0) {
        arg0.destroy();
    };
    imports.wbg.__wbg_detachShader_ab39d8a19811cfa6 = function(arg0, arg1, arg2) {
        arg0.detachShader(arg1, arg2);
    };
    imports.wbg.__wbg_detachShader_cd3ab294e635ff90 = function(arg0, arg1, arg2) {
        arg0.detachShader(arg1, arg2);
    };
    imports.wbg.__wbg_devicePixelContentBoxSize_a6de82cb30d70825 = function(arg0) {
        const ret = arg0.devicePixelContentBoxSize;
        return ret;
    };
    imports.wbg.__wbg_devicePixelRatio_68c391265f05d093 = function(arg0) {
        const ret = arg0.devicePixelRatio;
        return ret;
    };
    imports.wbg.__wbg_disableVertexAttribArray_452cc9815fced7e4 = function(arg0, arg1) {
        arg0.disableVertexAttribArray(arg1 >>> 0);
    };
    imports.wbg.__wbg_disableVertexAttribArray_afd097fb465dc100 = function(arg0, arg1) {
        arg0.disableVertexAttribArray(arg1 >>> 0);
    };
    imports.wbg.__wbg_disable_2702df5b5da5dd21 = function(arg0, arg1) {
        arg0.disable(arg1 >>> 0);
    };
    imports.wbg.__wbg_disable_8b53998501a7a85b = function(arg0, arg1) {
        arg0.disable(arg1 >>> 0);
    };
    imports.wbg.__wbg_disconnect_ac3f4ba550970c76 = function(arg0) {
        arg0.disconnect();
    };
    imports.wbg.__wbg_document_d249400bd7bd996d = function(arg0) {
        const ret = arg0.document;
        return isLikeNone(ret) ? 0 : addToExternrefTable0(ret);
    };
    imports.wbg.__wbg_drawElements_16199ef1cc58b16a = function(arg0, arg1, arg2, arg3, arg4) {
        arg0.drawElements(arg1 >>> 0, arg2, arg3 >>> 0, arg4);
    };
    imports.wbg.__wbg_drawElements_65cb4b099bd7d4ac = function(arg0, arg1, arg2, arg3, arg4) {
        arg0.drawElements(arg1 >>> 0, arg2, arg3 >>> 0, arg4);
    };
    imports.wbg.__wbg_drawIndexedIndirect_be91509f770824ce = function(arg0, arg1, arg2) {
        arg0.drawIndexedIndirect(arg1, arg2);
    };
    imports.wbg.__wbg_drawIndexed_9630a902d798b33a = function(arg0, arg1, arg2, arg3, arg4, arg5) {
        arg0.drawIndexed(arg1 >>> 0, arg2 >>> 0, arg3 >>> 0, arg4, arg5 >>> 0);
    };
    imports.wbg.__wbg_drawIndirect_8faa4f1da4ff33df = function(arg0, arg1, arg2) {
        arg0.drawIndirect(arg1, arg2);
    };
    imports.wbg.__wbg_draw_bc653b0541918c36 = function(arg0, arg1, arg2, arg3, arg4) {
        arg0.draw(arg1 >>> 0, arg2 >>> 0, arg3 >>> 0, arg4 >>> 0);
    };
    imports.wbg.__wbg_elementFromPoint_be6286b8ec1ae1a2 = function(arg0, arg1, arg2) {
        const ret = arg0.elementFromPoint(arg1, arg2);
        return isLikeNone(ret) ? 0 : addToExternrefTable0(ret);
    };
    imports.wbg.__wbg_enableVertexAttribArray_607be07574298e5e = function(arg0, arg1) {
        arg0.enableVertexAttribArray(arg1 >>> 0);
    };
    imports.wbg.__wbg_enableVertexAttribArray_93c3d406a41ad6c7 = function(arg0, arg1) {
        arg0.enableVertexAttribArray(arg1 >>> 0);
    };
    imports.wbg.__wbg_enable_51114837e05ee280 = function(arg0, arg1) {
        arg0.enable(arg1 >>> 0);
    };
    imports.wbg.__wbg_enable_d183fef39258803f = function(arg0, arg1) {
        arg0.enable(arg1 >>> 0);
    };
    imports.wbg.__wbg_end_cef808041153bd0d = function(arg0) {
        arg0.end();
    };
    imports.wbg.__wbg_error_963a3d03216025cc = function(arg0) {
        const ret = arg0.error;
        return ret;
    };
    imports.wbg.__wbg_error_bbc7e5d1a0911165 = function(arg0, arg1) {
        let deferred0_0;
        let deferred0_1;
        try {
            deferred0_0 = arg0;
            deferred0_1 = arg1;
            console.error(getStringFromWasm0(arg0, arg1));
        } finally {
            wasm.__wbindgen_free(deferred0_0, deferred0_1, 1);
        }
    };
    imports.wbg.__wbg_executeBundles_1f4ad141a970e092 = function(arg0, arg1) {
        arg0.executeBundles(arg1);
    };
    imports.wbg.__wbg_features_32c0d4ac3c605b35 = function(arg0) {
        const ret = arg0.features;
        return ret;
    };
    imports.wbg.__wbg_features_b2ad8b1ab8fa97a0 = function(arg0) {
        const ret = arg0.features;
        return ret;
    };
    imports.wbg.__wbg_files_5f07ac9b6f9116a7 = function(arg0) {
        const ret = arg0.files;
        return isLikeNone(ret) ? 0 : addToExternrefTable0(ret);
    };
    imports.wbg.__wbg_focus_7d08b55eba7b368d = function() { return handleError(function (arg0) {
        arg0.focus();
    }, arguments) };
    imports.wbg.__wbg_force_6e5acfdea2af0a4f = function(arg0) {
        const ret = arg0.force;
        return ret;
    };
    imports.wbg.__wbg_generateMipmap_13d3d6406de35b14 = function(arg0, arg1) {
        arg0.generateMipmap(arg1 >>> 0);
    };
    imports.wbg.__wbg_generateMipmap_e3b21a330b500089 = function(arg0, arg1) {
        arg0.generateMipmap(arg1 >>> 0);
    };
    imports.wbg.__wbg_getAttribLocation_959c0150cdd39cac = function(arg0, arg1, arg2, arg3) {
        const ret = arg0.getAttribLocation(arg1, getStringFromWasm0(arg2, arg3));
        return ret;
    };
    imports.wbg.__wbg_getAttribLocation_9db82d01924fa43d = function(arg0, arg1, arg2, arg3) {
        const ret = arg0.getAttribLocation(arg1, getStringFromWasm0(arg2, arg3));
        return ret;
    };
    imports.wbg.__wbg_getBoundingClientRect_9073b0ff7574d76b = function(arg0) {
        const ret = arg0.getBoundingClientRect();
        return ret;
    };
    imports.wbg.__wbg_getComputedStyle_046dd6472f8e7f1d = function() { return handleError(function (arg0, arg1) {
        const ret = arg0.getComputedStyle(arg1);
        return isLikeNone(ret) ? 0 : addToExternrefTable0(ret);
    }, arguments) };
    imports.wbg.__wbg_getContext_e9cf379449413580 = function() { return handleError(function (arg0, arg1, arg2) {
        const ret = arg0.getContext(getStringFromWasm0(arg1, arg2));
        return isLikeNone(ret) ? 0 : addToExternrefTable0(ret);
    }, arguments) };
    imports.wbg.__wbg_getData_84cc441a50843727 = function() { return handleError(function (arg0, arg1, arg2, arg3) {
        const ret = arg1.getData(getStringFromWasm0(arg2, arg3));
        const ptr1 = passStringToWasm0(ret, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len1 = WASM_VECTOR_LEN;
        getDataViewMemory0().setInt32(arg0 + 4 * 1, len1, true);
        getDataViewMemory0().setInt32(arg0 + 4 * 0, ptr1, true);
    }, arguments) };
    imports.wbg.__wbg_getElementById_f827f0d6648718a8 = function(arg0, arg1, arg2) {
        const ret = arg0.getElementById(getStringFromWasm0(arg1, arg2));
        return isLikeNone(ret) ? 0 : addToExternrefTable0(ret);
    };
    imports.wbg.__wbg_getError_578ee28e31637d2f = function(arg0) {
        const ret = arg0.getError();
        return ret;
    };
    imports.wbg.__wbg_getError_d749701e28a45150 = function(arg0) {
        const ret = arg0.getError();
        return ret;
    };
    imports.wbg.__wbg_getExtension_e6c97409b224b5dc = function() { return handleError(function (arg0, arg1, arg2) {
        const ret = arg0.getExtension(getStringFromWasm0(arg1, arg2));
        return isLikeNone(ret) ? 0 : addToExternrefTable0(ret);
    }, arguments) };
    imports.wbg.__wbg_getExtension_ff0fb1398bcf28c3 = function() { return handleError(function (arg0, arg1, arg2) {
        const ret = arg0.getExtension(getStringFromWasm0(arg1, arg2));
        return isLikeNone(ret) ? 0 : addToExternrefTable0(ret);
    }, arguments) };
    imports.wbg.__wbg_getItem_17f98dee3b43fa7e = function() { return handleError(function (arg0, arg1, arg2, arg3) {
        const ret = arg1.getItem(getStringFromWasm0(arg2, arg3));
        var ptr1 = isLikeNone(ret) ? 0 : passStringToWasm0(ret, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        var len1 = WASM_VECTOR_LEN;
        getDataViewMemory0().setInt32(arg0 + 4 * 1, len1, true);
        getDataViewMemory0().setInt32(arg0 + 4 * 0, ptr1, true);
    }, arguments) };
    imports.wbg.__wbg_getMappedRange_3a4bbbb308ae221b = function() { return handleError(function (arg0, arg1, arg2) {
        const ret = arg0.getMappedRange(arg1, arg2);
        return ret;
    }, arguments) };
    imports.wbg.__wbg_getParameter_1f0887a2b88e6d19 = function() { return handleError(function (arg0, arg1) {
        const ret = arg0.getParameter(arg1 >>> 0);
        return ret;
    }, arguments) };
    imports.wbg.__wbg_getParameter_e3429f024018310f = function() { return handleError(function (arg0, arg1) {
        const ret = arg0.getParameter(arg1 >>> 0);
        return ret;
    }, arguments) };
    imports.wbg.__wbg_getProgramInfoLog_631c180b1b21c8ed = function(arg0, arg1, arg2) {
        const ret = arg1.getProgramInfoLog(arg2);
        var ptr1 = isLikeNone(ret) ? 0 : passStringToWasm0(ret, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        var len1 = WASM_VECTOR_LEN;
        getDataViewMemory0().setInt32(arg0 + 4 * 1, len1, true);
        getDataViewMemory0().setInt32(arg0 + 4 * 0, ptr1, true);
    };
    imports.wbg.__wbg_getProgramInfoLog_a998105a680059db = function(arg0, arg1, arg2) {
        const ret = arg1.getProgramInfoLog(arg2);
        var ptr1 = isLikeNone(ret) ? 0 : passStringToWasm0(ret, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        var len1 = WASM_VECTOR_LEN;
        getDataViewMemory0().setInt32(arg0 + 4 * 1, len1, true);
        getDataViewMemory0().setInt32(arg0 + 4 * 0, ptr1, true);
    };
    imports.wbg.__wbg_getProgramParameter_0c411f0cd4185c5b = function(arg0, arg1, arg2) {
        const ret = arg0.getProgramParameter(arg1, arg2 >>> 0);
        return ret;
    };
    imports.wbg.__wbg_getProgramParameter_360f95ff07ac068d = function(arg0, arg1, arg2) {
        const ret = arg0.getProgramParameter(arg1, arg2 >>> 0);
        return ret;
    };
    imports.wbg.__wbg_getPropertyValue_e623c23a05dfb30c = function() { return handleError(function (arg0, arg1, arg2, arg3) {
        const ret = arg1.getPropertyValue(getStringFromWasm0(arg2, arg3));
        const ptr1 = passStringToWasm0(ret, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len1 = WASM_VECTOR_LEN;
        getDataViewMemory0().setInt32(arg0 + 4 * 1, len1, true);
        getDataViewMemory0().setInt32(arg0 + 4 * 0, ptr1, true);
    }, arguments) };
    imports.wbg.__wbg_getShaderInfoLog_7e7b38fb910ec534 = function(arg0, arg1, arg2) {
        const ret = arg1.getShaderInfoLog(arg2);
        var ptr1 = isLikeNone(ret) ? 0 : passStringToWasm0(ret, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        var len1 = WASM_VECTOR_LEN;
        getDataViewMemory0().setInt32(arg0 + 4 * 1, len1, true);
        getDataViewMemory0().setInt32(arg0 + 4 * 0, ptr1, true);
    };
    imports.wbg.__wbg_getShaderInfoLog_f59c3112acc6e039 = function(arg0, arg1, arg2) {
        const ret = arg1.getShaderInfoLog(arg2);
        var ptr1 = isLikeNone(ret) ? 0 : passStringToWasm0(ret, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        var len1 = WASM_VECTOR_LEN;
        getDataViewMemory0().setInt32(arg0 + 4 * 1, len1, true);
        getDataViewMemory0().setInt32(arg0 + 4 * 0, ptr1, true);
    };
    imports.wbg.__wbg_getShaderParameter_511b5f929074fa31 = function(arg0, arg1, arg2) {
        const ret = arg0.getShaderParameter(arg1, arg2 >>> 0);
        return ret;
    };
    imports.wbg.__wbg_getShaderParameter_6dbe0b8558dc41fd = function(arg0, arg1, arg2) {
        const ret = arg0.getShaderParameter(arg1, arg2 >>> 0);
        return ret;
    };
    imports.wbg.__wbg_getSupportedExtensions_3938cc3251d21f05 = function(arg0) {
        const ret = arg0.getSupportedExtensions();
        return isLikeNone(ret) ? 0 : addToExternrefTable0(ret);
    };
    imports.wbg.__wbg_getSupportedExtensions_8c007dbb54905635 = function(arg0) {
        const ret = arg0.getSupportedExtensions();
        return isLikeNone(ret) ? 0 : addToExternrefTable0(ret);
    };
    imports.wbg.__wbg_getUniformLocation_657a2b6d102bd126 = function(arg0, arg1, arg2, arg3) {
        const ret = arg0.getUniformLocation(arg1, getStringFromWasm0(arg2, arg3));
        return isLikeNone(ret) ? 0 : addToExternrefTable0(ret);
    };
    imports.wbg.__wbg_getUniformLocation_838363001c74dc21 = function(arg0, arg1, arg2, arg3) {
        const ret = arg0.getUniformLocation(arg1, getStringFromWasm0(arg2, arg3));
        return isLikeNone(ret) ? 0 : addToExternrefTable0(ret);
    };
    imports.wbg.__wbg_get_3091cb4339203d1a = function(arg0, arg1) {
        const ret = arg0[arg1 >>> 0];
        return isLikeNone(ret) ? 0 : addToExternrefTable0(ret);
    };
    imports.wbg.__wbg_get_4095561f3d5ec806 = function(arg0, arg1) {
        const ret = arg0[arg1 >>> 0];
        return isLikeNone(ret) ? 0 : addToExternrefTable0(ret);
    };
    imports.wbg.__wbg_get_8edd839202d9f4db = function(arg0, arg1) {
        const ret = arg0[arg1 >>> 0];
        return isLikeNone(ret) ? 0 : addToExternrefTable0(ret);
    };
    imports.wbg.__wbg_get_b9b93047fe3cf45b = function(arg0, arg1) {
        const ret = arg0[arg1 >>> 0];
        return ret;
    };
    imports.wbg.__wbg_has_40063a8cb4a2d7a1 = function(arg0, arg1, arg2) {
        const ret = arg0.has(getStringFromWasm0(arg1, arg2));
        return ret;
    };
    imports.wbg.__wbg_hash_dd4b49269c385c8a = function() { return handleError(function (arg0, arg1) {
        const ret = arg1.hash;
        const ptr1 = passStringToWasm0(ret, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len1 = WASM_VECTOR_LEN;
        getDataViewMemory0().setInt32(arg0 + 4 * 1, len1, true);
        getDataViewMemory0().setInt32(arg0 + 4 * 0, ptr1, true);
    }, arguments) };
    imports.wbg.__wbg_height_1f8226c8f6875110 = function(arg0) {
        const ret = arg0.height;
        return ret;
    };
    imports.wbg.__wbg_height_838cee19ba8597db = function(arg0) {
        const ret = arg0.height;
        return ret;
    };
    imports.wbg.__wbg_hidden_d5c02c79a2b77bb6 = function(arg0) {
        const ret = arg0.hidden;
        return ret;
    };
    imports.wbg.__wbg_host_9bd7b5dc07c48606 = function() { return handleError(function (arg0, arg1) {
        const ret = arg1.host;
        const ptr1 = passStringToWasm0(ret, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len1 = WASM_VECTOR_LEN;
        getDataViewMemory0().setInt32(arg0 + 4 * 1, len1, true);
        getDataViewMemory0().setInt32(arg0 + 4 * 0, ptr1, true);
    }, arguments) };
    imports.wbg.__wbg_hostname_8d7204884eb7378b = function() { return handleError(function (arg0, arg1) {
        const ret = arg1.hostname;
        const ptr1 = passStringToWasm0(ret, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len1 = WASM_VECTOR_LEN;
        getDataViewMemory0().setInt32(arg0 + 4 * 1, len1, true);
        getDataViewMemory0().setInt32(arg0 + 4 * 0, ptr1, true);
    }, arguments) };
    imports.wbg.__wbg_href_87d60a783a012377 = function() { return handleError(function (arg0, arg1) {
        const ret = arg1.href;
        const ptr1 = passStringToWasm0(ret, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len1 = WASM_VECTOR_LEN;
        getDataViewMemory0().setInt32(arg0 + 4 * 1, len1, true);
        getDataViewMemory0().setInt32(arg0 + 4 * 0, ptr1, true);
    }, arguments) };
    imports.wbg.__wbg_id_c65402eae48fb242 = function(arg0, arg1) {
        const ret = arg1.id;
        const ptr1 = passStringToWasm0(ret, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len1 = WASM_VECTOR_LEN;
        getDataViewMemory0().setInt32(arg0 + 4 * 1, len1, true);
        getDataViewMemory0().setInt32(arg0 + 4 * 0, ptr1, true);
    };
    imports.wbg.__wbg_identifier_59e0705aef81ff93 = function(arg0) {
        const ret = arg0.identifier;
        return ret;
    };
    imports.wbg.__wbg_info_1fa0a04953ab28a7 = function(arg0, arg1) {
        console.info(getStringFromWasm0(arg0, arg1));
    };
    imports.wbg.__wbg_inlineSize_8ff96b3ec1b24423 = function(arg0) {
        const ret = arg0.inlineSize;
        return ret;
    };
    imports.wbg.__wbg_instanceof_Element_0af65443936d5154 = function(arg0) {
        let result;
        try {
            result = arg0 instanceof Element;
        } catch (_) {
            result = false;
        }
        const ret = result;
        return ret;
    };
    imports.wbg.__wbg_instanceof_GpuDeviceLostInfo_52d4416a2ff49952 = function(arg0) {
        let result;
        try {
            result = arg0 instanceof GPUDeviceLostInfo;
        } catch (_) {
            result = false;
        }
        const ret = result;
        return ret;
    };
    imports.wbg.__wbg_instanceof_GpuOutOfMemoryError_fcdbb77ac9407f31 = function(arg0) {
        let result;
        try {
            result = arg0 instanceof GPUOutOfMemoryError;
        } catch (_) {
            result = false;
        }
        const ret = result;
        return ret;
    };
    imports.wbg.__wbg_instanceof_GpuValidationError_ff57f213d14fc3ac = function(arg0) {
        let result;
        try {
            result = arg0 instanceof GPUValidationError;
        } catch (_) {
            result = false;
        }
        const ret = result;
        return ret;
    };
    imports.wbg.__wbg_instanceof_HtmlCanvasElement_2ea67072a7624ac5 = function(arg0) {
        let result;
        try {
            result = arg0 instanceof HTMLCanvasElement;
        } catch (_) {
            result = false;
        }
        const ret = result;
        return ret;
    };
    imports.wbg.__wbg_instanceof_HtmlElement_51378c201250b16c = function(arg0) {
        let result;
        try {
            result = arg0 instanceof HTMLElement;
        } catch (_) {
            result = false;
        }
        const ret = result;
        return ret;
    };
    imports.wbg.__wbg_instanceof_HtmlInputElement_12d71bf2d15dd19e = function(arg0) {
        let result;
        try {
            result = arg0 instanceof HTMLInputElement;
        } catch (_) {
            result = false;
        }
        const ret = result;
        return ret;
    };
    imports.wbg.__wbg_instanceof_Object_7f2dcef8f78644a4 = function(arg0) {
        let result;
        try {
            result = arg0 instanceof Object;
        } catch (_) {
            result = false;
        }
        const ret = result;
        return ret;
    };
    imports.wbg.__wbg_instanceof_ResizeObserverEntry_cb85a268a84783ba = function(arg0) {
        let result;
        try {
            result = arg0 instanceof ResizeObserverEntry;
        } catch (_) {
            result = false;
        }
        const ret = result;
        return ret;
    };
    imports.wbg.__wbg_instanceof_ResizeObserverSize_4138fd53d59e1653 = function(arg0) {
        let result;
        try {
            result = arg0 instanceof ResizeObserverSize;
        } catch (_) {
            result = false;
        }
        const ret = result;
        return ret;
    };
    imports.wbg.__wbg_instanceof_WebGl2RenderingContext_2b6045efeb76568d = function(arg0) {
        let result;
        try {
            result = arg0 instanceof WebGL2RenderingContext;
        } catch (_) {
            result = false;
        }
        const ret = result;
        return ret;
    };
    imports.wbg.__wbg_instanceof_WebGlRenderingContext_b9cbe798424f6d4c = function(arg0) {
        let result;
        try {
            result = arg0 instanceof WebGLRenderingContext;
        } catch (_) {
            result = false;
        }
        const ret = result;
        return ret;
    };
    imports.wbg.__wbg_instanceof_Window_def73ea0955fc569 = function(arg0) {
        let result;
        try {
            result = arg0 instanceof Window;
        } catch (_) {
            result = false;
        }
        const ret = result;
        return ret;
    };
    imports.wbg.__wbg_isComposing_36511555ff1869a4 = function(arg0) {
        const ret = arg0.isComposing;
        return ret;
    };
    imports.wbg.__wbg_isComposing_6e36768c82fd5a4f = function(arg0) {
        const ret = arg0.isComposing;
        return ret;
    };
    imports.wbg.__wbg_isSecureContext_aedcf3816338189a = function(arg0) {
        const ret = arg0.isSecureContext;
        return ret;
    };
    imports.wbg.__wbg_is_c7481c65e7e5df9e = function(arg0, arg1) {
        const ret = Object.is(arg0, arg1);
        return ret;
    };
    imports.wbg.__wbg_item_aea4b8432b5457be = function(arg0, arg1) {
        const ret = arg0.item(arg1 >>> 0);
        return isLikeNone(ret) ? 0 : addToExternrefTable0(ret);
    };
    imports.wbg.__wbg_items_89c2afbece3a5d13 = function(arg0) {
        const ret = arg0.items;
        return ret;
    };
    imports.wbg.__wbg_keyCode_237a8d1a040910b8 = function(arg0) {
        const ret = arg0.keyCode;
        return ret;
    };
    imports.wbg.__wbg_key_7b5c6cb539be8e13 = function(arg0, arg1) {
        const ret = arg1.key;
        const ptr1 = passStringToWasm0(ret, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len1 = WASM_VECTOR_LEN;
        getDataViewMemory0().setInt32(arg0 + 4 * 1, len1, true);
        getDataViewMemory0().setInt32(arg0 + 4 * 0, ptr1, true);
    };
    imports.wbg.__wbg_lastModified_7a9e61b3961224b8 = function(arg0) {
        const ret = arg0.lastModified;
        return ret;
    };
    imports.wbg.__wbg_left_e46801720267b66d = function(arg0) {
        const ret = arg0.left;
        return ret;
    };
    imports.wbg.__wbg_length_1d5c829e9b2319d6 = function(arg0) {
        const ret = arg0.length;
        return ret;
    };
    imports.wbg.__wbg_length_802483321c8130cf = function(arg0) {
        const ret = arg0.length;
        return ret;
    };
    imports.wbg.__wbg_length_a446193dc22c12f8 = function(arg0) {
        const ret = arg0.length;
        return ret;
    };
    imports.wbg.__wbg_length_cfc862ec0ccc7ca0 = function(arg0) {
        const ret = arg0.length;
        return ret;
    };
    imports.wbg.__wbg_length_e2d2a49132c1b256 = function(arg0) {
        const ret = arg0.length;
        return ret;
    };
    imports.wbg.__wbg_limits_8bc028d702bb12df = function(arg0) {
        const ret = arg0.limits;
        return ret;
    };
    imports.wbg.__wbg_limits_ac05a37bc81653a8 = function(arg0) {
        const ret = arg0.limits;
        return ret;
    };
    imports.wbg.__wbg_linkProgram_067ee06739bdde81 = function(arg0, arg1) {
        arg0.linkProgram(arg1);
    };
    imports.wbg.__wbg_linkProgram_e002979fe36e5b2a = function(arg0, arg1) {
        arg0.linkProgram(arg1);
    };
    imports.wbg.__wbg_localStorage_1406c99c39728187 = function() { return handleError(function (arg0) {
        const ret = arg0.localStorage;
        return isLikeNone(ret) ? 0 : addToExternrefTable0(ret);
    }, arguments) };
    imports.wbg.__wbg_location_350d99456c2f3693 = function(arg0) {
        const ret = arg0.location;
        return ret;
    };
    imports.wbg.__wbg_lost_d1b094b5e7c96fdb = function(arg0) {
        const ret = arg0.lost;
        return ret;
    };
    imports.wbg.__wbg_mapAsync_58963e8ed2adafbb = function(arg0, arg1, arg2, arg3) {
        const ret = arg0.mapAsync(arg1 >>> 0, arg2, arg3);
        return ret;
    };
    imports.wbg.__wbg_matchMedia_bf8807a841d930c1 = function() { return handleError(function (arg0, arg1, arg2) {
        const ret = arg0.matchMedia(getStringFromWasm0(arg1, arg2));
        return isLikeNone(ret) ? 0 : addToExternrefTable0(ret);
    }, arguments) };
    imports.wbg.__wbg_matches_e9ca73fbf8a3a104 = function(arg0) {
        const ret = arg0.matches;
        return ret;
    };
    imports.wbg.__wbg_matches_f579d2efd905ab4f = function(arg0) {
        const ret = arg0.matches;
        return ret;
    };
    imports.wbg.__wbg_maxBindGroups_0222dcf9e174a4be = function(arg0) {
        const ret = arg0.maxBindGroups;
        return ret;
    };
    imports.wbg.__wbg_maxBindingsPerBindGroup_30a6b12dbcf8069d = function(arg0) {
        const ret = arg0.maxBindingsPerBindGroup;
        return ret;
    };
    imports.wbg.__wbg_maxBufferSize_8fb2143272621179 = function(arg0) {
        const ret = arg0.maxBufferSize;
        return ret;
    };
    imports.wbg.__wbg_maxColorAttachmentBytesPerSample_a812509fd9bd676b = function(arg0) {
        const ret = arg0.maxColorAttachmentBytesPerSample;
        return ret;
    };
    imports.wbg.__wbg_maxColorAttachments_9fbd199d61afc1f5 = function(arg0) {
        const ret = arg0.maxColorAttachments;
        return ret;
    };
    imports.wbg.__wbg_maxComputeInvocationsPerWorkgroup_7fa6b4db368a2126 = function(arg0) {
        const ret = arg0.maxComputeInvocationsPerWorkgroup;
        return ret;
    };
    imports.wbg.__wbg_maxComputeWorkgroupSizeX_c4d9a824f2bf9960 = function(arg0) {
        const ret = arg0.maxComputeWorkgroupSizeX;
        return ret;
    };
    imports.wbg.__wbg_maxComputeWorkgroupSizeY_9e52efeb0aca31d3 = function(arg0) {
        const ret = arg0.maxComputeWorkgroupSizeY;
        return ret;
    };
    imports.wbg.__wbg_maxComputeWorkgroupSizeZ_f5b8807576c43db6 = function(arg0) {
        const ret = arg0.maxComputeWorkgroupSizeZ;
        return ret;
    };
    imports.wbg.__wbg_maxComputeWorkgroupStorageSize_7b38ae516290af07 = function(arg0) {
        const ret = arg0.maxComputeWorkgroupStorageSize;
        return ret;
    };
    imports.wbg.__wbg_maxComputeWorkgroupsPerDimension_d9554109ab21ce47 = function(arg0) {
        const ret = arg0.maxComputeWorkgroupsPerDimension;
        return ret;
    };
    imports.wbg.__wbg_maxDynamicStorageBuffersPerPipelineLayout_c29218793cde6f24 = function(arg0) {
        const ret = arg0.maxDynamicStorageBuffersPerPipelineLayout;
        return ret;
    };
    imports.wbg.__wbg_maxDynamicUniformBuffersPerPipelineLayout_680aa7c1b3e0700c = function(arg0) {
        const ret = arg0.maxDynamicUniformBuffersPerPipelineLayout;
        return ret;
    };
    imports.wbg.__wbg_maxSampledTexturesPerShaderStage_99a7ba8d7ca1221e = function(arg0) {
        const ret = arg0.maxSampledTexturesPerShaderStage;
        return ret;
    };
    imports.wbg.__wbg_maxSamplersPerShaderStage_374e0f0050a42508 = function(arg0) {
        const ret = arg0.maxSamplersPerShaderStage;
        return ret;
    };
    imports.wbg.__wbg_maxStorageBufferBindingSize_7de8660008eabc4a = function(arg0) {
        const ret = arg0.maxStorageBufferBindingSize;
        return ret;
    };
    imports.wbg.__wbg_maxStorageBuffersPerShaderStage_2af5e62ac198180c = function(arg0) {
        const ret = arg0.maxStorageBuffersPerShaderStage;
        return ret;
    };
    imports.wbg.__wbg_maxStorageTexturesPerShaderStage_1333853bcc12d28f = function(arg0) {
        const ret = arg0.maxStorageTexturesPerShaderStage;
        return ret;
    };
    imports.wbg.__wbg_maxTextureArrayLayers_b9d811b9edb96b7a = function(arg0) {
        const ret = arg0.maxTextureArrayLayers;
        return ret;
    };
    imports.wbg.__wbg_maxTextureDimension1D_12a27fca428edfe6 = function(arg0) {
        const ret = arg0.maxTextureDimension1D;
        return ret;
    };
    imports.wbg.__wbg_maxTextureDimension2D_76c550ad1fb81966 = function(arg0) {
        const ret = arg0.maxTextureDimension2D;
        return ret;
    };
    imports.wbg.__wbg_maxTextureDimension3D_55e3acf13a2b455b = function(arg0) {
        const ret = arg0.maxTextureDimension3D;
        return ret;
    };
    imports.wbg.__wbg_maxUniformBufferBindingSize_deba3c1afed3be24 = function(arg0) {
        const ret = arg0.maxUniformBufferBindingSize;
        return ret;
    };
    imports.wbg.__wbg_maxUniformBuffersPerShaderStage_01fc2dbf06098c31 = function(arg0) {
        const ret = arg0.maxUniformBuffersPerShaderStage;
        return ret;
    };
    imports.wbg.__wbg_maxVertexAttributes_c18639452fa244e8 = function(arg0) {
        const ret = arg0.maxVertexAttributes;
        return ret;
    };
    imports.wbg.__wbg_maxVertexBufferArrayStride_69bfb89aae827641 = function(arg0) {
        const ret = arg0.maxVertexBufferArrayStride;
        return ret;
    };
    imports.wbg.__wbg_maxVertexBuffers_6cd09df3032ef900 = function(arg0) {
        const ret = arg0.maxVertexBuffers;
        return ret;
    };
    imports.wbg.__wbg_message_1388766d17a7ad4b = function(arg0, arg1) {
        const ret = arg1.message;
        const ptr1 = passStringToWasm0(ret, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len1 = WASM_VECTOR_LEN;
        getDataViewMemory0().setInt32(arg0 + 4 * 1, len1, true);
        getDataViewMemory0().setInt32(arg0 + 4 * 0, ptr1, true);
    };
    imports.wbg.__wbg_message_19ca94ca8e24efe4 = function(arg0, arg1) {
        const ret = arg1.message;
        const ptr1 = passStringToWasm0(ret, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len1 = WASM_VECTOR_LEN;
        getDataViewMemory0().setInt32(arg0 + 4 * 1, len1, true);
        getDataViewMemory0().setInt32(arg0 + 4 * 0, ptr1, true);
    };
    imports.wbg.__wbg_metaKey_0b25f7848e014cc8 = function(arg0) {
        const ret = arg0.metaKey;
        return ret;
    };
    imports.wbg.__wbg_metaKey_e1dd47d709a80ce5 = function(arg0) {
        const ret = arg0.metaKey;
        return ret;
    };
    imports.wbg.__wbg_minStorageBufferOffsetAlignment_92f8686c6346577b = function(arg0) {
        const ret = arg0.minStorageBufferOffsetAlignment;
        return ret;
    };
    imports.wbg.__wbg_minUniformBufferOffsetAlignment_06720d80b84c4715 = function(arg0) {
        const ret = arg0.minUniformBufferOffsetAlignment;
        return ret;
    };
    imports.wbg.__wbg_name_28c43f147574bf08 = function(arg0, arg1) {
        const ret = arg1.name;
        const ptr1 = passStringToWasm0(ret, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len1 = WASM_VECTOR_LEN;
        getDataViewMemory0().setInt32(arg0 + 4 * 1, len1, true);
        getDataViewMemory0().setInt32(arg0 + 4 * 0, ptr1, true);
    };
    imports.wbg.__wbg_navigator_1577371c070c8947 = function(arg0) {
        const ret = arg0.navigator;
        return ret;
    };
    imports.wbg.__wbg_new_405e22f390576ce2 = function() {
        const ret = new Object();
        return ret;
    };
    imports.wbg.__wbg_new_5136e00935bbc0fc = function() {
        const ret = new Error();
        return ret;
    };
    imports.wbg.__wbg_new_5f34cc0c99fcc488 = function() { return handleError(function (arg0) {
        const ret = new ResizeObserver(arg0);
        return ret;
    }, arguments) };
    imports.wbg.__wbg_new_78feb108b6472713 = function() {
        const ret = new Array();
        return ret;
    };
    imports.wbg.__wbg_new_a12002a7f91c75be = function(arg0) {
        const ret = new Uint8Array(arg0);
        return ret;
    };
    imports.wbg.__wbg_newnoargs_105ed471475aaf50 = function(arg0, arg1) {
        const ret = new Function(getStringFromWasm0(arg0, arg1));
        return ret;
    };
    imports.wbg.__wbg_newwithbyteoffsetandlength_840f3c038856d4e9 = function(arg0, arg1, arg2) {
        const ret = new Int8Array(arg0, arg1 >>> 0, arg2 >>> 0);
        return ret;
    };
    imports.wbg.__wbg_newwithbyteoffsetandlength_999332a180064b59 = function(arg0, arg1, arg2) {
        const ret = new Int32Array(arg0, arg1 >>> 0, arg2 >>> 0);
        return ret;
    };
    imports.wbg.__wbg_newwithbyteoffsetandlength_d4a86622320ea258 = function(arg0, arg1, arg2) {
        const ret = new Uint16Array(arg0, arg1 >>> 0, arg2 >>> 0);
        return ret;
    };
    imports.wbg.__wbg_newwithbyteoffsetandlength_d97e637ebe145a9a = function(arg0, arg1, arg2) {
        const ret = new Uint8Array(arg0, arg1 >>> 0, arg2 >>> 0);
        return ret;
    };
    imports.wbg.__wbg_newwithbyteoffsetandlength_e6b7e69acd4c7354 = function(arg0, arg1, arg2) {
        const ret = new Float32Array(arg0, arg1 >>> 0, arg2 >>> 0);
        return ret;
    };
    imports.wbg.__wbg_newwithbyteoffsetandlength_f1dead44d1fc7212 = function(arg0, arg1, arg2) {
        const ret = new Uint32Array(arg0, arg1 >>> 0, arg2 >>> 0);
        return ret;
    };
    imports.wbg.__wbg_newwithbyteoffsetandlength_f254047f7e80e7ff = function(arg0, arg1, arg2) {
        const ret = new Int16Array(arg0, arg1 >>> 0, arg2 >>> 0);
        return ret;
    };
    imports.wbg.__wbg_newwithrecordfromstrtoblobpromise_53d3e3611a048f1e = function() { return handleError(function (arg0) {
        const ret = new ClipboardItem(arg0);
        return ret;
    }, arguments) };
    imports.wbg.__wbg_newwithtext_4beba0b832dd9cc1 = function() { return handleError(function (arg0, arg1) {
        const ret = new SpeechSynthesisUtterance(getStringFromWasm0(arg0, arg1));
        return ret;
    }, arguments) };
    imports.wbg.__wbg_newwithu8arraysequenceandoptions_068570c487f69127 = function() { return handleError(function (arg0, arg1) {
        const ret = new Blob(arg0, arg1);
        return ret;
    }, arguments) };
    imports.wbg.__wbg_now_2c95c9de01293173 = function(arg0) {
        const ret = arg0.now();
        return ret;
    };
    imports.wbg.__wbg_now_d18023d54d4e5500 = function(arg0) {
        const ret = arg0.now();
        return ret;
    };
    imports.wbg.__wbg_observe_ed4adb1c245103c5 = function(arg0, arg1, arg2) {
        arg0.observe(arg1, arg2);
    };
    imports.wbg.__wbg_of_2eaf5a02d443ef03 = function(arg0) {
        const ret = Array.of(arg0);
        return ret;
    };
    imports.wbg.__wbg_offsetTop_de8d0722bd1b211d = function(arg0) {
        const ret = arg0.offsetTop;
        return ret;
    };
    imports.wbg.__wbg_open_6c3f5ef5a0204c5d = function() { return handleError(function (arg0, arg1, arg2, arg3, arg4) {
        const ret = arg0.open(getStringFromWasm0(arg1, arg2), getStringFromWasm0(arg3, arg4));
        return isLikeNone(ret) ? 0 : addToExternrefTable0(ret);
    }, arguments) };
    imports.wbg.__wbg_origin_7c5d649acdace3ea = function() { return handleError(function (arg0, arg1) {
        const ret = arg1.origin;
        const ptr1 = passStringToWasm0(ret, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len1 = WASM_VECTOR_LEN;
        getDataViewMemory0().setInt32(arg0 + 4 * 1, len1, true);
        getDataViewMemory0().setInt32(arg0 + 4 * 0, ptr1, true);
    }, arguments) };
    imports.wbg.__wbg_performance_7a3ffd0b17f663ad = function(arg0) {
        const ret = arg0.performance;
        return ret;
    };
    imports.wbg.__wbg_performance_c185c0cdc2766575 = function(arg0) {
        const ret = arg0.performance;
        return isLikeNone(ret) ? 0 : addToExternrefTable0(ret);
    };
    imports.wbg.__wbg_pixelStorei_6aba5d04cdcaeaf6 = function(arg0, arg1, arg2) {
        arg0.pixelStorei(arg1 >>> 0, arg2);
    };
    imports.wbg.__wbg_pixelStorei_c8520e4b46f4a973 = function(arg0, arg1, arg2) {
        arg0.pixelStorei(arg1 >>> 0, arg2);
    };
    imports.wbg.__wbg_popErrorScope_07dadc34c43e4d72 = function(arg0) {
        const ret = arg0.popErrorScope();
        return ret;
    };
    imports.wbg.__wbg_port_008e0061f421df1d = function() { return handleError(function (arg0, arg1) {
        const ret = arg1.port;
        const ptr1 = passStringToWasm0(ret, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len1 = WASM_VECTOR_LEN;
        getDataViewMemory0().setInt32(arg0 + 4 * 1, len1, true);
        getDataViewMemory0().setInt32(arg0 + 4 * 0, ptr1, true);
    }, arguments) };
    imports.wbg.__wbg_preventDefault_c2314fd813c02b3c = function(arg0) {
        arg0.preventDefault();
    };
    imports.wbg.__wbg_protocol_faa0494a9b2554cb = function() { return handleError(function (arg0, arg1) {
        const ret = arg1.protocol;
        const ptr1 = passStringToWasm0(ret, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len1 = WASM_VECTOR_LEN;
        getDataViewMemory0().setInt32(arg0 + 4 * 1, len1, true);
        getDataViewMemory0().setInt32(arg0 + 4 * 0, ptr1, true);
    }, arguments) };
    imports.wbg.__wbg_pushErrorScope_000179c1f54d42a8 = function(arg0, arg1) {
        arg0.pushErrorScope(__wbindgen_enum_GpuErrorFilter[arg1]);
    };
    imports.wbg.__wbg_push_737cfc8c1432c2c6 = function(arg0, arg1) {
        const ret = arg0.push(arg1);
        return ret;
    };
    imports.wbg.__wbg_queueMicrotask_97d92b4fcc8a61c5 = function(arg0) {
        queueMicrotask(arg0);
    };
    imports.wbg.__wbg_queueMicrotask_d3219def82552485 = function(arg0) {
        const ret = arg0.queueMicrotask;
        return ret;
    };
    imports.wbg.__wbg_queue_07fadd40f69596cf = function(arg0) {
        const ret = arg0.queue;
        return ret;
    };
    imports.wbg.__wbg_readPixels_51a0c02cdee207a5 = function() { return handleError(function (arg0, arg1, arg2, arg3, arg4, arg5, arg6, arg7) {
        arg0.readPixels(arg1, arg2, arg3, arg4, arg5 >>> 0, arg6 >>> 0, arg7);
    }, arguments) };
    imports.wbg.__wbg_readPixels_a6cbb21794452142 = function() { return handleError(function (arg0, arg1, arg2, arg3, arg4, arg5, arg6, arg7) {
        arg0.readPixels(arg1, arg2, arg3, arg4, arg5 >>> 0, arg6 >>> 0, arg7);
    }, arguments) };
    imports.wbg.__wbg_readPixels_cd64c5a7b0343355 = function() { return handleError(function (arg0, arg1, arg2, arg3, arg4, arg5, arg6, arg7) {
        arg0.readPixels(arg1, arg2, arg3, arg4, arg5 >>> 0, arg6 >>> 0, arg7);
    }, arguments) };
    imports.wbg.__wbg_reason_829b8eadaa43fd8d = function(arg0) {
        const ret = arg0.reason;
        return (__wbindgen_enum_GpuDeviceLostReason.indexOf(ret) + 1 || 3) - 1;
    };
    imports.wbg.__wbg_removeEventListener_056dfe8c3d6c58f9 = function() { return handleError(function (arg0, arg1, arg2, arg3) {
        arg0.removeEventListener(getStringFromWasm0(arg1, arg2), arg3);
    }, arguments) };
    imports.wbg.__wbg_remove_e2d2659f3128c045 = function(arg0) {
        arg0.remove();
    };
    imports.wbg.__wbg_requestAnimationFrame_d7fd890aaefc3246 = function() { return handleError(function (arg0, arg1) {
        const ret = arg0.requestAnimationFrame(arg1);
        return ret;
    }, arguments) };
    imports.wbg.__wbg_requestDevice_0898fac1fbdf2ee0 = function(arg0, arg1) {
        const ret = arg0.requestDevice(arg1);
        return ret;
    };
    imports.wbg.__wbg_resolve_4851785c9c5f573d = function(arg0) {
        const ret = Promise.resolve(arg0);
        return ret;
    };
    imports.wbg.__wbg_right_54416a875852cab1 = function(arg0) {
        const ret = arg0.right;
        return ret;
    };
    imports.wbg.__wbg_scissor_e917a332f67a5d30 = function(arg0, arg1, arg2, arg3, arg4) {
        arg0.scissor(arg1, arg2, arg3, arg4);
    };
    imports.wbg.__wbg_scissor_eb177ca33bf24a44 = function(arg0, arg1, arg2, arg3, arg4) {
        arg0.scissor(arg1, arg2, arg3, arg4);
    };
    imports.wbg.__wbg_search_c1c3bfbeadd96c47 = function() { return handleError(function (arg0, arg1) {
        const ret = arg1.search;
        const ptr1 = passStringToWasm0(ret, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len1 = WASM_VECTOR_LEN;
        getDataViewMemory0().setInt32(arg0 + 4 * 1, len1, true);
        getDataViewMemory0().setInt32(arg0 + 4 * 0, ptr1, true);
    }, arguments) };
    imports.wbg.__wbg_setAttribute_2704501201f15687 = function() { return handleError(function (arg0, arg1, arg2, arg3, arg4) {
        arg0.setAttribute(getStringFromWasm0(arg1, arg2), getStringFromWasm0(arg3, arg4));
    }, arguments) };
    imports.wbg.__wbg_setBindGroup_632b618c68dc9f77 = function() { return handleError(function (arg0, arg1, arg2, arg3, arg4, arg5, arg6) {
        arg0.setBindGroup(arg1 >>> 0, arg2, getArrayU32FromWasm0(arg3, arg4), arg5, arg6 >>> 0);
    }, arguments) };
    imports.wbg.__wbg_setBindGroup_ea05eb10fc49de2c = function(arg0, arg1, arg2) {
        arg0.setBindGroup(arg1 >>> 0, arg2);
    };
    imports.wbg.__wbg_setBlendConstant_19134b18452dcfaf = function() { return handleError(function (arg0, arg1) {
        arg0.setBlendConstant(arg1);
    }, arguments) };
    imports.wbg.__wbg_setIndexBuffer_6fdef8096e73d553 = function(arg0, arg1, arg2, arg3) {
        arg0.setIndexBuffer(arg1, __wbindgen_enum_GpuIndexFormat[arg2], arg3);
    };
    imports.wbg.__wbg_setIndexBuffer_99e96e62ae121182 = function(arg0, arg1, arg2, arg3, arg4) {
        arg0.setIndexBuffer(arg1, __wbindgen_enum_GpuIndexFormat[arg2], arg3, arg4);
    };
    imports.wbg.__wbg_setItem_212ecc915942ab0a = function() { return handleError(function (arg0, arg1, arg2, arg3, arg4) {
        arg0.setItem(getStringFromWasm0(arg1, arg2), getStringFromWasm0(arg3, arg4));
    }, arguments) };
    imports.wbg.__wbg_setPipeline_8233c7936dc027eb = function(arg0, arg1) {
        arg0.setPipeline(arg1);
    };
    imports.wbg.__wbg_setProperty_f2cf326652b9a713 = function() { return handleError(function (arg0, arg1, arg2, arg3, arg4) {
        arg0.setProperty(getStringFromWasm0(arg1, arg2), getStringFromWasm0(arg3, arg4));
    }, arguments) };
    imports.wbg.__wbg_setScissorRect_7035d4f33e6cdfc4 = function(arg0, arg1, arg2, arg3, arg4) {
        arg0.setScissorRect(arg1 >>> 0, arg2 >>> 0, arg3 >>> 0, arg4 >>> 0);
    };
    imports.wbg.__wbg_setStencilReference_8fad6cc4d843225f = function(arg0, arg1) {
        arg0.setStencilReference(arg1 >>> 0);
    };
    imports.wbg.__wbg_setVertexBuffer_89830d9370d83055 = function(arg0, arg1, arg2, arg3) {
        arg0.setVertexBuffer(arg1 >>> 0, arg2, arg3);
    };
    imports.wbg.__wbg_setVertexBuffer_adaa0ebdc693bdd6 = function(arg0, arg1, arg2, arg3, arg4) {
        arg0.setVertexBuffer(arg1 >>> 0, arg2, arg3, arg4);
    };
    imports.wbg.__wbg_setViewport_6ba3ad0032681508 = function(arg0, arg1, arg2, arg3, arg4, arg5, arg6) {
        arg0.setViewport(arg1, arg2, arg3, arg4, arg5, arg6);
    };
    imports.wbg.__wbg_set_65595bdd868b3009 = function(arg0, arg1, arg2) {
        arg0.set(arg1, arg2 >>> 0);
    };
    imports.wbg.__wbg_set_bb8cecf6a62b9f46 = function() { return handleError(function (arg0, arg1, arg2) {
        const ret = Reflect.set(arg0, arg1, arg2);
        return ret;
    }, arguments) };
    imports.wbg.__wbg_seta_8c37ec6a4dc0d942 = function(arg0, arg1) {
        arg0.a = arg1;
    };
    imports.wbg.__wbg_setaccess_7d2db8bdc4b6abaf = function(arg0, arg1) {
        arg0.access = __wbindgen_enum_GpuStorageTextureAccess[arg1];
    };
    imports.wbg.__wbg_setaddressmodeu_8ecb484bdff9072b = function(arg0, arg1) {
        arg0.addressModeU = __wbindgen_enum_GpuAddressMode[arg1];
    };
    imports.wbg.__wbg_setaddressmodev_137c06246a8d6998 = function(arg0, arg1) {
        arg0.addressModeV = __wbindgen_enum_GpuAddressMode[arg1];
    };
    imports.wbg.__wbg_setaddressmodew_98bd8e5c43a4e53f = function(arg0, arg1) {
        arg0.addressModeW = __wbindgen_enum_GpuAddressMode[arg1];
    };
    imports.wbg.__wbg_setalpha_67e8a0133c76b196 = function(arg0, arg1) {
        arg0.alpha = arg1;
    };
    imports.wbg.__wbg_setalphatocoverageenabled_f3099e11ac4d6bcb = function(arg0, arg1) {
        arg0.alphaToCoverageEnabled = arg1 !== 0;
    };
    imports.wbg.__wbg_setarraystride_ab886497af6421dd = function(arg0, arg1) {
        arg0.arrayStride = arg1;
    };
    imports.wbg.__wbg_setaspect_2b6d01d5c086fcf7 = function(arg0, arg1) {
        arg0.aspect = __wbindgen_enum_GpuTextureAspect[arg1];
    };
    imports.wbg.__wbg_setattributes_598c85d07995dcad = function(arg0, arg1) {
        arg0.attributes = arg1;
    };
    imports.wbg.__wbg_setautofocus_6ca6f0ab5a566c21 = function() { return handleError(function (arg0, arg1) {
        arg0.autofocus = arg1 !== 0;
    }, arguments) };
    imports.wbg.__wbg_setb_2838f75b15ad51fe = function(arg0, arg1) {
        arg0.b = arg1;
    };
    imports.wbg.__wbg_setbindgrouplayouts_ce817396e66a6491 = function(arg0, arg1) {
        arg0.bindGroupLayouts = arg1;
    };
    imports.wbg.__wbg_setbinding_7dce03c2d1573ff1 = function(arg0, arg1) {
        arg0.binding = arg1 >>> 0;
    };
    imports.wbg.__wbg_setbinding_b53661662ece573a = function(arg0, arg1) {
        arg0.binding = arg1 >>> 0;
    };
    imports.wbg.__wbg_setblend_c39af7eab992aca9 = function(arg0, arg1) {
        arg0.blend = arg1;
    };
    imports.wbg.__wbg_setbox_2786f3ccea97cac4 = function(arg0, arg1) {
        arg0.box = __wbindgen_enum_ResizeObserverBoxOptions[arg1];
    };
    imports.wbg.__wbg_setbuffer_1f237099cd97492f = function(arg0, arg1) {
        arg0.buffer = arg1;
    };
    imports.wbg.__wbg_setbuffer_318a5127f2da3de1 = function(arg0, arg1) {
        arg0.buffer = arg1;
    };
    imports.wbg.__wbg_setbuffers_b6aba77853e4d6d1 = function(arg0, arg1) {
        arg0.buffers = arg1;
    };
    imports.wbg.__wbg_setbytesperrow_6ce070381aae29f0 = function(arg0, arg1) {
        arg0.bytesPerRow = arg1 >>> 0;
    };
    imports.wbg.__wbg_setcode_e73c9c295721c2f2 = function(arg0, arg1, arg2) {
        arg0.code = getStringFromWasm0(arg1, arg2);
    };
    imports.wbg.__wbg_setcolor_819abd0fb1131d02 = function(arg0, arg1) {
        arg0.color = arg1;
    };
    imports.wbg.__wbg_setcolorformats_c6ed8f92f0255764 = function(arg0, arg1) {
        arg0.colorFormats = arg1;
    };
    imports.wbg.__wbg_setcompare_b023a2248a3f8d85 = function(arg0, arg1) {
        arg0.compare = __wbindgen_enum_GpuCompareFunction[arg1];
    };
    imports.wbg.__wbg_setcompare_e5ac0271436dca89 = function(arg0, arg1) {
        arg0.compare = __wbindgen_enum_GpuCompareFunction[arg1];
    };
    imports.wbg.__wbg_setcompute_5b724825a19b509f = function(arg0, arg1) {
        arg0.compute = arg1;
    };
    imports.wbg.__wbg_setcount_18d97c7cf8168bdc = function(arg0, arg1) {
        arg0.count = arg1 >>> 0;
    };
    imports.wbg.__wbg_setcount_d4f8ede64bfbfb9f = function(arg0, arg1) {
        arg0.count = arg1 >>> 0;
    };
    imports.wbg.__wbg_setcullmode_b0b9228e5a6bbee1 = function(arg0, arg1) {
        arg0.cullMode = __wbindgen_enum_GpuCullMode[arg1];
    };
    imports.wbg.__wbg_setdepthbias_d1b77192ae7c92dc = function(arg0, arg1) {
        arg0.depthBias = arg1;
    };
    imports.wbg.__wbg_setdepthbiasclamp_43a6b817bc908767 = function(arg0, arg1) {
        arg0.depthBiasClamp = arg1;
    };
    imports.wbg.__wbg_setdepthbiasslopescale_a60b8cb9f7ed9e28 = function(arg0, arg1) {
        arg0.depthBiasSlopeScale = arg1;
    };
    imports.wbg.__wbg_setdepthcompare_d3a1d904dc3f8e13 = function(arg0, arg1) {
        arg0.depthCompare = __wbindgen_enum_GpuCompareFunction[arg1];
    };
    imports.wbg.__wbg_setdepthfailop_4464200c7ba82032 = function(arg0, arg1) {
        arg0.depthFailOp = __wbindgen_enum_GpuStencilOperation[arg1];
    };
    imports.wbg.__wbg_setdepthorarraylayers_c717d2357ab22f54 = function(arg0, arg1) {
        arg0.depthOrArrayLayers = arg1 >>> 0;
    };
    imports.wbg.__wbg_setdepthreadonly_e7c8f7ffdefc83b9 = function(arg0, arg1) {
        arg0.depthReadOnly = arg1 !== 0;
    };
    imports.wbg.__wbg_setdepthstencil_ec813981cda848e2 = function(arg0, arg1) {
        arg0.depthStencil = arg1;
    };
    imports.wbg.__wbg_setdepthstencilformat_4d7fd0cce22d7a93 = function(arg0, arg1) {
        arg0.depthStencilFormat = __wbindgen_enum_GpuTextureFormat[arg1];
    };
    imports.wbg.__wbg_setdepthwriteenabled_e1c8886ad063172b = function(arg0, arg1) {
        arg0.depthWriteEnabled = arg1 !== 0;
    };
    imports.wbg.__wbg_setdimension_8057c4c73cef3af9 = function(arg0, arg1) {
        arg0.dimension = __wbindgen_enum_GpuTextureDimension[arg1];
    };
    imports.wbg.__wbg_setdstfactor_33446a1fd3fcf7fc = function(arg0, arg1) {
        arg0.dstFactor = __wbindgen_enum_GpuBlendFactor[arg1];
    };
    imports.wbg.__wbg_setentries_0fda6faa888739ea = function(arg0, arg1) {
        arg0.entries = arg1;
    };
    imports.wbg.__wbg_setentries_54d064bfa9bc7b12 = function(arg0, arg1) {
        arg0.entries = arg1;
    };
    imports.wbg.__wbg_setentrypoint_43b3e9729237c5de = function(arg0, arg1, arg2) {
        arg0.entryPoint = getStringFromWasm0(arg1, arg2);
    };
    imports.wbg.__wbg_setentrypoint_94ded7045723c4c9 = function(arg0, arg1, arg2) {
        arg0.entryPoint = getStringFromWasm0(arg1, arg2);
    };
    imports.wbg.__wbg_setentrypoint_cf488b0e095835d9 = function(arg0, arg1, arg2) {
        arg0.entryPoint = getStringFromWasm0(arg1, arg2);
    };
    imports.wbg.__wbg_setfailop_272a90502ff61a02 = function(arg0, arg1) {
        arg0.failOp = __wbindgen_enum_GpuStencilOperation[arg1];
    };
    imports.wbg.__wbg_setflipy_a047dd048a3ef7c3 = function(arg0, arg1) {
        arg0.flipY = arg1 !== 0;
    };
    imports.wbg.__wbg_setformat_5518a5b8b32fa569 = function(arg0, arg1) {
        arg0.format = __wbindgen_enum_GpuTextureFormat[arg1];
    };
    imports.wbg.__wbg_setformat_9c93df780505899c = function(arg0, arg1) {
        arg0.format = __wbindgen_enum_GpuTextureFormat[arg1];
    };
    imports.wbg.__wbg_setformat_abfdc57a4c50f15b = function(arg0, arg1) {
        arg0.format = __wbindgen_enum_GpuTextureFormat[arg1];
    };
    imports.wbg.__wbg_setformat_c73368f2bb45a48c = function(arg0, arg1) {
        arg0.format = __wbindgen_enum_GpuTextureFormat[arg1];
    };
    imports.wbg.__wbg_setformat_e74ce658cb637f16 = function(arg0, arg1) {
        arg0.format = __wbindgen_enum_GpuVertexFormat[arg1];
    };
    imports.wbg.__wbg_setfragment_a13e304b0b2a260a = function(arg0, arg1) {
        arg0.fragment = arg1;
    };
    imports.wbg.__wbg_setfrontface_b614e7e50412e765 = function(arg0, arg1) {
        arg0.frontFace = __wbindgen_enum_GpuFrontFace[arg1];
    };
    imports.wbg.__wbg_setg_b13ae7afa6fb5191 = function(arg0, arg1) {
        arg0.g = arg1;
    };
    imports.wbg.__wbg_sethasdynamicoffset_f07968ae158be239 = function(arg0, arg1) {
        arg0.hasDynamicOffset = arg1 !== 0;
    };
    imports.wbg.__wbg_setheight_0bbc5ea7a006f0d0 = function(arg0, arg1) {
        arg0.height = arg1 >>> 0;
    };
    imports.wbg.__wbg_setheight_da683a33fa99843c = function(arg0, arg1) {
        arg0.height = arg1 >>> 0;
    };
    imports.wbg.__wbg_setinnerHTML_31bde41f835786f7 = function(arg0, arg1, arg2) {
        arg0.innerHTML = getStringFromWasm0(arg1, arg2);
    };
    imports.wbg.__wbg_setlabel_157b1d8622dd50c9 = function(arg0, arg1, arg2) {
        arg0.label = getStringFromWasm0(arg1, arg2);
    };
    imports.wbg.__wbg_setlabel_180ec2ab4a10c5b6 = function(arg0, arg1, arg2) {
        arg0.label = getStringFromWasm0(arg1, arg2);
    };
    imports.wbg.__wbg_setlabel_1edb158e2c2e74dc = function(arg0, arg1, arg2) {
        arg0.label = getStringFromWasm0(arg1, arg2);
    };
    imports.wbg.__wbg_setlabel_2c993f94aad39d77 = function(arg0, arg1, arg2) {
        arg0.label = getStringFromWasm0(arg1, arg2);
    };
    imports.wbg.__wbg_setlabel_2d06fdef5bb757c8 = function(arg0, arg1, arg2) {
        arg0.label = getStringFromWasm0(arg1, arg2);
    };
    imports.wbg.__wbg_setlabel_36ecf2050a2605aa = function(arg0, arg1, arg2) {
        arg0.label = getStringFromWasm0(arg1, arg2);
    };
    imports.wbg.__wbg_setlabel_43a6de7484b1227c = function(arg0, arg1, arg2) {
        arg0.label = getStringFromWasm0(arg1, arg2);
    };
    imports.wbg.__wbg_setlabel_5b070c6a4b43fb6b = function(arg0, arg1, arg2) {
        arg0.label = getStringFromWasm0(arg1, arg2);
    };
    imports.wbg.__wbg_setlabel_9e0830b7fb87d84c = function(arg0, arg1, arg2) {
        arg0.label = getStringFromWasm0(arg1, arg2);
    };
    imports.wbg.__wbg_setlabel_a55dce2de6e15aae = function(arg0, arg1, arg2) {
        arg0.label = getStringFromWasm0(arg1, arg2);
    };
    imports.wbg.__wbg_setlabel_deacdb16914ca965 = function(arg0, arg1, arg2) {
        arg0.label = getStringFromWasm0(arg1, arg2);
    };
    imports.wbg.__wbg_setlabel_eef1f4ed7cef4fa5 = function(arg0, arg1, arg2) {
        arg0.label = getStringFromWasm0(arg1, arg2);
    };
    imports.wbg.__wbg_setlabel_fa444683138df2fe = function(arg0, arg1, arg2) {
        arg0.label = getStringFromWasm0(arg1, arg2);
    };
    imports.wbg.__wbg_setlayout_06e2e064ceddf18a = function(arg0, arg1) {
        arg0.layout = arg1;
    };
    imports.wbg.__wbg_setlayout_4b7e6ca70a207b81 = function(arg0, arg1) {
        arg0.layout = arg1;
    };
    imports.wbg.__wbg_setlayout_d7a47c6e044b6c31 = function(arg0, arg1) {
        arg0.layout = arg1;
    };
    imports.wbg.__wbg_setlodmaxclamp_e41c91083e3682b5 = function(arg0, arg1) {
        arg0.lodMaxClamp = arg1;
    };
    imports.wbg.__wbg_setlodminclamp_9faefbbc42272a79 = function(arg0, arg1) {
        arg0.lodMinClamp = arg1;
    };
    imports.wbg.__wbg_setmagfilter_b56158de70f6769f = function(arg0, arg1) {
        arg0.magFilter = __wbindgen_enum_GpuFilterMode[arg1];
    };
    imports.wbg.__wbg_setmappedatcreation_cac8944b747e87ee = function(arg0, arg1) {
        arg0.mappedAtCreation = arg1 !== 0;
    };
    imports.wbg.__wbg_setmask_91c4f7e0f0e36bf1 = function(arg0, arg1) {
        arg0.mask = arg1 >>> 0;
    };
    imports.wbg.__wbg_setmaxanisotropy_f14de7b49292221a = function(arg0, arg1) {
        arg0.maxAnisotropy = arg1;
    };
    imports.wbg.__wbg_setminbindingsize_2a736b24cd429dca = function(arg0, arg1) {
        arg0.minBindingSize = arg1;
    };
    imports.wbg.__wbg_setminfilter_e4b8e96e246c6da7 = function(arg0, arg1) {
        arg0.minFilter = __wbindgen_enum_GpuFilterMode[arg1];
    };
    imports.wbg.__wbg_setmiplevel_6a71e2cfd8970a56 = function(arg0, arg1) {
        arg0.mipLevel = arg1 >>> 0;
    };
    imports.wbg.__wbg_setmiplevel_9a18e2be9c90dfa1 = function(arg0, arg1) {
        arg0.mipLevel = arg1 >>> 0;
    };
    imports.wbg.__wbg_setmiplevelcount_5e3cf300cc917eac = function(arg0, arg1) {
        arg0.mipLevelCount = arg1 >>> 0;
    };
    imports.wbg.__wbg_setmipmapfilter_d5839c3230b62193 = function(arg0, arg1) {
        arg0.mipmapFilter = __wbindgen_enum_GpuMipmapFilterMode[arg1];
    };
    imports.wbg.__wbg_setmodule_7148e7ff8beb9f87 = function(arg0, arg1) {
        arg0.module = arg1;
    };
    imports.wbg.__wbg_setmodule_93ed62cf753a965e = function(arg0, arg1) {
        arg0.module = arg1;
    };
    imports.wbg.__wbg_setmodule_a48408076f7dc829 = function(arg0, arg1) {
        arg0.module = arg1;
    };
    imports.wbg.__wbg_setmultisample_28733ff702dd7d06 = function(arg0, arg1) {
        arg0.multisample = arg1;
    };
    imports.wbg.__wbg_setmultisampled_89aa3f8ca1864ad3 = function(arg0, arg1) {
        arg0.multisampled = arg1 !== 0;
    };
    imports.wbg.__wbg_setoffset_1716b8e5cd8fbf43 = function(arg0, arg1) {
        arg0.offset = arg1;
    };
    imports.wbg.__wbg_setoffset_3821c5113e651e21 = function(arg0, arg1) {
        arg0.offset = arg1;
    };
    imports.wbg.__wbg_setoffset_60f54b835838d86a = function(arg0, arg1) {
        arg0.offset = arg1;
    };
    imports.wbg.__wbg_setonce_0cb80aea26303a35 = function(arg0, arg1) {
        arg0.once = arg1 !== 0;
    };
    imports.wbg.__wbg_setonuncapturederror_518c02e8160fb680 = function(arg0, arg1) {
        arg0.onuncapturederror = arg1;
    };
    imports.wbg.__wbg_setoperation_2e502e27c9f935f2 = function(arg0, arg1) {
        arg0.operation = __wbindgen_enum_GpuBlendOperation[arg1];
    };
    imports.wbg.__wbg_setorigin_04bf522ba1fc32b1 = function(arg0, arg1) {
        arg0.origin = arg1;
    };
    imports.wbg.__wbg_setorigin_cdf201826a03f906 = function(arg0, arg1) {
        arg0.origin = arg1;
    };
    imports.wbg.__wbg_setorigin_fd428e87a85e4f78 = function(arg0, arg1) {
        arg0.origin = arg1;
    };
    imports.wbg.__wbg_setpassop_49d207e004d55780 = function(arg0, arg1) {
        arg0.passOp = __wbindgen_enum_GpuStencilOperation[arg1];
    };
    imports.wbg.__wbg_setpitch_5f1e968545051707 = function(arg0, arg1) {
        arg0.pitch = arg1;
    };
    imports.wbg.__wbg_setpremultipliedalpha_6ee89af40ad8fafb = function(arg0, arg1) {
        arg0.premultipliedAlpha = arg1 !== 0;
    };
    imports.wbg.__wbg_setprimitive_9e643fae7bdd11a1 = function(arg0, arg1) {
        arg0.primitive = arg1;
    };
    imports.wbg.__wbg_setr_57c0630a5ed56abe = function(arg0, arg1) {
        arg0.r = arg1;
    };
    imports.wbg.__wbg_setrate_e0aa4bfe9a720dc5 = function(arg0, arg1) {
        arg0.rate = arg1;
    };
    imports.wbg.__wbg_setrequiredfeatures_360aae2ce3d2381c = function(arg0, arg1) {
        arg0.requiredFeatures = arg1;
    };
    imports.wbg.__wbg_setresource_9ffa3eaa40694cfd = function(arg0, arg1) {
        arg0.resource = arg1;
    };
    imports.wbg.__wbg_setrowsperimage_7ed931cad260aeef = function(arg0, arg1) {
        arg0.rowsPerImage = arg1 >>> 0;
    };
    imports.wbg.__wbg_setsamplecount_62f6a4b85315b7b5 = function(arg0, arg1) {
        arg0.sampleCount = arg1 >>> 0;
    };
    imports.wbg.__wbg_setsamplecount_996272924ce89396 = function(arg0, arg1) {
        arg0.sampleCount = arg1 >>> 0;
    };
    imports.wbg.__wbg_setsampler_b4f51284cbe80f7a = function(arg0, arg1) {
        arg0.sampler = arg1;
    };
    imports.wbg.__wbg_setsampletype_6cf538bd15193d22 = function(arg0, arg1) {
        arg0.sampleType = __wbindgen_enum_GpuTextureSampleType[arg1];
    };
    imports.wbg.__wbg_setshaderlocation_0f4930e2ec27dac2 = function(arg0, arg1) {
        arg0.shaderLocation = arg1 >>> 0;
    };
    imports.wbg.__wbg_setsize_80b65e0d806c11cf = function(arg0, arg1) {
        arg0.size = arg1;
    };
    imports.wbg.__wbg_setsize_b2e7d5d7b2596519 = function(arg0, arg1) {
        arg0.size = arg1;
    };
    imports.wbg.__wbg_setsize_bb5ced7d3ef6c87d = function(arg0, arg1) {
        arg0.size = arg1;
    };
    imports.wbg.__wbg_setsource_a92b123b36424bd8 = function(arg0, arg1) {
        arg0.source = arg1;
    };
    imports.wbg.__wbg_setsrcfactor_a8fa6d89d12b456b = function(arg0, arg1) {
        arg0.srcFactor = __wbindgen_enum_GpuBlendFactor[arg1];
    };
    imports.wbg.__wbg_setstencilback_819eadcf62e54218 = function(arg0, arg1) {
        arg0.stencilBack = arg1;
    };
    imports.wbg.__wbg_setstencilfront_b15c7795e9b2c99c = function(arg0, arg1) {
        arg0.stencilFront = arg1;
    };
    imports.wbg.__wbg_setstencilreadmask_aa7b602667e77aef = function(arg0, arg1) {
        arg0.stencilReadMask = arg1 >>> 0;
    };
    imports.wbg.__wbg_setstencilreadonly_566f671bdd1206fa = function(arg0, arg1) {
        arg0.stencilReadOnly = arg1 !== 0;
    };
    imports.wbg.__wbg_setstencilwritemask_35dbcb0199b674a1 = function(arg0, arg1) {
        arg0.stencilWriteMask = arg1 >>> 0;
    };
    imports.wbg.__wbg_setstepmode_e86991dc4fd17beb = function(arg0, arg1) {
        arg0.stepMode = __wbindgen_enum_GpuVertexStepMode[arg1];
    };
    imports.wbg.__wbg_setstoragetexture_a2790d3972c2f24f = function(arg0, arg1) {
        arg0.storageTexture = arg1;
    };
    imports.wbg.__wbg_setstripindexformat_d2530c6caaaaca80 = function(arg0, arg1) {
        arg0.stripIndexFormat = __wbindgen_enum_GpuIndexFormat[arg1];
    };
    imports.wbg.__wbg_settabIndex_31adfec3c7eafbce = function(arg0, arg1) {
        arg0.tabIndex = arg1;
    };
    imports.wbg.__wbg_settargets_9652a18e0ffd0072 = function(arg0, arg1) {
        arg0.targets = arg1;
    };
    imports.wbg.__wbg_settexture_8b04f8cd9a60319e = function(arg0, arg1) {
        arg0.texture = arg1;
    };
    imports.wbg.__wbg_settexture_ec8d99cea23e86a2 = function(arg0, arg1) {
        arg0.texture = arg1;
    };
    imports.wbg.__wbg_settexture_f27f10646ce2b382 = function(arg0, arg1) {
        arg0.texture = arg1;
    };
    imports.wbg.__wbg_settopology_896761f74dd7070b = function(arg0, arg1) {
        arg0.topology = __wbindgen_enum_GpuPrimitiveTopology[arg1];
    };
    imports.wbg.__wbg_settype_2a902a4a235bb64a = function(arg0, arg1, arg2) {
        arg0.type = getStringFromWasm0(arg1, arg2);
    };
    imports.wbg.__wbg_settype_39ed370d3edd403c = function(arg0, arg1, arg2) {
        arg0.type = getStringFromWasm0(arg1, arg2);
    };
    imports.wbg.__wbg_settype_488746298c38e568 = function(arg0, arg1) {
        arg0.type = __wbindgen_enum_GpuQueryType[arg1];
    };
    imports.wbg.__wbg_settype_99009480de5e94f7 = function(arg0, arg1) {
        arg0.type = __wbindgen_enum_GpuBufferBindingType[arg1];
    };
    imports.wbg.__wbg_settype_ead65507d10d5a19 = function(arg0, arg1) {
        arg0.type = __wbindgen_enum_GpuSamplerBindingType[arg1];
    };
    imports.wbg.__wbg_setusage_315bbe56aa41adb7 = function(arg0, arg1) {
        arg0.usage = arg1 >>> 0;
    };
    imports.wbg.__wbg_setusage_7de66baaeab73b73 = function(arg0, arg1) {
        arg0.usage = arg1 >>> 0;
    };
    imports.wbg.__wbg_setvalue_6ad9ef6c692ea746 = function(arg0, arg1, arg2) {
        arg0.value = getStringFromWasm0(arg1, arg2);
    };
    imports.wbg.__wbg_setvertex_57723b3f81e01871 = function(arg0, arg1) {
        arg0.vertex = arg1;
    };
    imports.wbg.__wbg_setviewdimension_2d081b42f954e69e = function(arg0, arg1) {
        arg0.viewDimension = __wbindgen_enum_GpuTextureViewDimension[arg1];
    };
    imports.wbg.__wbg_setviewdimension_be1a9557869e379a = function(arg0, arg1) {
        arg0.viewDimension = __wbindgen_enum_GpuTextureViewDimension[arg1];
    };
    imports.wbg.__wbg_setviewformats_e7cd56272e8b50f7 = function(arg0, arg1) {
        arg0.viewFormats = arg1;
    };
    imports.wbg.__wbg_setvisibility_2c1274e59ee7befc = function(arg0, arg1) {
        arg0.visibility = arg1 >>> 0;
    };
    imports.wbg.__wbg_setvolume_791fef19f3df9b00 = function(arg0, arg1) {
        arg0.volume = arg1;
    };
    imports.wbg.__wbg_setwidth_ac1637796ff7d1e0 = function(arg0, arg1) {
        arg0.width = arg1 >>> 0;
    };
    imports.wbg.__wbg_setwidth_c5fed9f5e7f0b406 = function(arg0, arg1) {
        arg0.width = arg1 >>> 0;
    };
    imports.wbg.__wbg_setwritemask_ee5c954691bc1969 = function(arg0, arg1) {
        arg0.writeMask = arg1 >>> 0;
    };
    imports.wbg.__wbg_setx_9d3e7a2f7a19b080 = function(arg0, arg1) {
        arg0.x = arg1 >>> 0;
    };
    imports.wbg.__wbg_setx_9eecfea5ef85dd8a = function(arg0, arg1) {
        arg0.x = arg1 >>> 0;
    };
    imports.wbg.__wbg_sety_60e02e634108e7c2 = function(arg0, arg1) {
        arg0.y = arg1 >>> 0;
    };
    imports.wbg.__wbg_sety_fd2e4e2a28f7cf0d = function(arg0, arg1) {
        arg0.y = arg1 >>> 0;
    };
    imports.wbg.__wbg_setz_4fa0cb1e0377f657 = function(arg0, arg1) {
        arg0.z = arg1 >>> 0;
    };
    imports.wbg.__wbg_shaderSource_72d3e8597ef85b67 = function(arg0, arg1, arg2, arg3) {
        arg0.shaderSource(arg1, getStringFromWasm0(arg2, arg3));
    };
    imports.wbg.__wbg_shaderSource_ad0087e637a35191 = function(arg0, arg1, arg2, arg3) {
        arg0.shaderSource(arg1, getStringFromWasm0(arg2, arg3));
    };
    imports.wbg.__wbg_shiftKey_2bebb3b703254f47 = function(arg0) {
        const ret = arg0.shiftKey;
        return ret;
    };
    imports.wbg.__wbg_shiftKey_86e737105bab1a54 = function(arg0) {
        const ret = arg0.shiftKey;
        return ret;
    };
    imports.wbg.__wbg_size_06c9dcdf888e63aa = function(arg0) {
        const ret = arg0.size;
        return ret;
    };
    imports.wbg.__wbg_size_3808d41635a9c259 = function(arg0) {
        const ret = arg0.size;
        return ret;
    };
    imports.wbg.__wbg_speak_edb998564c00bb2a = function(arg0, arg1) {
        arg0.speak(arg1);
    };
    imports.wbg.__wbg_speechSynthesis_74e411ffcf3fc3c7 = function() { return handleError(function (arg0) {
        const ret = arg0.speechSynthesis;
        return ret;
    }, arguments) };
    imports.wbg.__wbg_stack_0b83281de580e52f = function(arg0, arg1) {
        const ret = arg1.stack;
        const ptr1 = passStringToWasm0(ret, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len1 = WASM_VECTOR_LEN;
        getDataViewMemory0().setInt32(arg0 + 4 * 1, len1, true);
        getDataViewMemory0().setInt32(arg0 + 4 * 0, ptr1, true);
    };
    imports.wbg.__wbg_static_accessor_GLOBAL_88a902d13a557d07 = function() {
        const ret = typeof global === 'undefined' ? null : global;
        return isLikeNone(ret) ? 0 : addToExternrefTable0(ret);
    };
    imports.wbg.__wbg_static_accessor_GLOBAL_THIS_56578be7e9f832b0 = function() {
        const ret = typeof globalThis === 'undefined' ? null : globalThis;
        return isLikeNone(ret) ? 0 : addToExternrefTable0(ret);
    };
    imports.wbg.__wbg_static_accessor_SELF_37c5d418e4bf5819 = function() {
        const ret = typeof self === 'undefined' ? null : self;
        return isLikeNone(ret) ? 0 : addToExternrefTable0(ret);
    };
    imports.wbg.__wbg_static_accessor_WINDOW_5de37043a91a9c40 = function() {
        const ret = typeof window === 'undefined' ? null : window;
        return isLikeNone(ret) ? 0 : addToExternrefTable0(ret);
    };
    imports.wbg.__wbg_stopPropagation_11d220a858e5e0fb = function(arg0) {
        arg0.stopPropagation();
    };
    imports.wbg.__wbg_style_fb30c14e5815805c = function(arg0) {
        const ret = arg0.style;
        return ret;
    };
    imports.wbg.__wbg_submit_19d2c1e85fc7b46d = function(arg0, arg1) {
        arg0.submit(arg1);
    };
    imports.wbg.__wbg_texImage2D_57483314967bdd11 = function() { return handleError(function (arg0, arg1, arg2, arg3, arg4, arg5, arg6, arg7, arg8, arg9) {
        arg0.texImage2D(arg1 >>> 0, arg2, arg3, arg4, arg5, arg6, arg7 >>> 0, arg8 >>> 0, arg9);
    }, arguments) };
    imports.wbg.__wbg_texImage2D_5f2835f02b1d1077 = function() { return handleError(function (arg0, arg1, arg2, arg3, arg4, arg5, arg6, arg7, arg8, arg9) {
        arg0.texImage2D(arg1 >>> 0, arg2, arg3, arg4, arg5, arg6, arg7 >>> 0, arg8 >>> 0, arg9);
    }, arguments) };
    imports.wbg.__wbg_texImage2D_b8edcb5692f65f88 = function() { return handleError(function (arg0, arg1, arg2, arg3, arg4, arg5, arg6, arg7, arg8, arg9) {
        arg0.texImage2D(arg1 >>> 0, arg2, arg3, arg4, arg5, arg6, arg7 >>> 0, arg8 >>> 0, arg9);
    }, arguments) };
    imports.wbg.__wbg_texParameteri_8112b26b3c360b7e = function(arg0, arg1, arg2, arg3) {
        arg0.texParameteri(arg1 >>> 0, arg2 >>> 0, arg3);
    };
    imports.wbg.__wbg_texParameteri_ef50743cb94d507e = function(arg0, arg1, arg2, arg3) {
        arg0.texParameteri(arg1 >>> 0, arg2 >>> 0, arg3);
    };
    imports.wbg.__wbg_texSubImage2D_c7951ed97252bdff = function() { return handleError(function (arg0, arg1, arg2, arg3, arg4, arg5, arg6, arg7, arg8, arg9) {
        arg0.texSubImage2D(arg1 >>> 0, arg2, arg3, arg4, arg5, arg6, arg7 >>> 0, arg8 >>> 0, arg9);
    }, arguments) };
    imports.wbg.__wbg_texSubImage2D_d52d1a0d3654c60b = function() { return handleError(function (arg0, arg1, arg2, arg3, arg4, arg5, arg6, arg7, arg8, arg9) {
        arg0.texSubImage2D(arg1 >>> 0, arg2, arg3, arg4, arg5, arg6, arg7 >>> 0, arg8 >>> 0, arg9);
    }, arguments) };
    imports.wbg.__wbg_texSubImage2D_fbdf91268228c757 = function() { return handleError(function (arg0, arg1, arg2, arg3, arg4, arg5, arg6, arg7, arg8, arg9) {
        arg0.texSubImage2D(arg1 >>> 0, arg2, arg3, arg4, arg5, arg6, arg7 >>> 0, arg8 >>> 0, arg9);
    }, arguments) };
    imports.wbg.__wbg_then_44b73946d2fb3e7d = function(arg0, arg1) {
        const ret = arg0.then(arg1);
        return ret;
    };
    imports.wbg.__wbg_then_48b406749878a531 = function(arg0, arg1, arg2) {
        const ret = arg0.then(arg1, arg2);
        return ret;
    };
    imports.wbg.__wbg_top_ec9fceb1f030f2ea = function(arg0) {
        const ret = arg0.top;
        return ret;
    };
    imports.wbg.__wbg_touches_6831ee0099511603 = function(arg0) {
        const ret = arg0.touches;
        return ret;
    };
    imports.wbg.__wbg_type_00566e0d2e337e2e = function(arg0, arg1) {
        const ret = arg1.type;
        const ptr1 = passStringToWasm0(ret, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len1 = WASM_VECTOR_LEN;
        getDataViewMemory0().setInt32(arg0 + 4 * 1, len1, true);
        getDataViewMemory0().setInt32(arg0 + 4 * 0, ptr1, true);
    };
    imports.wbg.__wbg_type_20c7c49b2fbe0023 = function(arg0, arg1) {
        const ret = arg1.type;
        const ptr1 = passStringToWasm0(ret, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len1 = WASM_VECTOR_LEN;
        getDataViewMemory0().setInt32(arg0 + 4 * 1, len1, true);
        getDataViewMemory0().setInt32(arg0 + 4 * 0, ptr1, true);
    };
    imports.wbg.__wbg_uniform1i_5ddd9d8ccbd390bb = function(arg0, arg1, arg2) {
        arg0.uniform1i(arg1, arg2);
    };
    imports.wbg.__wbg_uniform1i_ed95b6129dce4d84 = function(arg0, arg1, arg2) {
        arg0.uniform1i(arg1, arg2);
    };
    imports.wbg.__wbg_uniform2f_56af4e1731d87421 = function(arg0, arg1, arg2, arg3) {
        arg0.uniform2f(arg1, arg2, arg3);
    };
    imports.wbg.__wbg_uniform2f_b69b5369bc019bd5 = function(arg0, arg1, arg2, arg3) {
        arg0.uniform2f(arg1, arg2, arg3);
    };
    imports.wbg.__wbg_unmap_bea8213fb4e5bbf2 = function(arg0) {
        arg0.unmap();
    };
    imports.wbg.__wbg_usage_d0fd1a28ec6ce557 = function(arg0) {
        const ret = arg0.usage;
        return ret;
    };
    imports.wbg.__wbg_useProgram_473bf913989b6089 = function(arg0, arg1) {
        arg0.useProgram(arg1);
    };
    imports.wbg.__wbg_useProgram_9b2660f7bb210471 = function(arg0, arg1) {
        arg0.useProgram(arg1);
    };
    imports.wbg.__wbg_userAgent_12e9d8e62297563f = function() { return handleError(function (arg0, arg1) {
        const ret = arg1.userAgent;
        const ptr1 = passStringToWasm0(ret, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len1 = WASM_VECTOR_LEN;
        getDataViewMemory0().setInt32(arg0 + 4 * 1, len1, true);
        getDataViewMemory0().setInt32(arg0 + 4 * 0, ptr1, true);
    }, arguments) };
    imports.wbg.__wbg_valueOf_39a18758c25e8b95 = function(arg0) {
        const ret = arg0.valueOf();
        return ret;
    };
    imports.wbg.__wbg_value_91cbf0dd3ab84c1e = function(arg0, arg1) {
        const ret = arg1.value;
        const ptr1 = passStringToWasm0(ret, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len1 = WASM_VECTOR_LEN;
        getDataViewMemory0().setInt32(arg0 + 4 * 1, len1, true);
        getDataViewMemory0().setInt32(arg0 + 4 * 0, ptr1, true);
    };
    imports.wbg.__wbg_vertexAttribPointer_550dc34903e3d1ea = function(arg0, arg1, arg2, arg3, arg4, arg5, arg6) {
        arg0.vertexAttribPointer(arg1 >>> 0, arg2, arg3 >>> 0, arg4 !== 0, arg5, arg6);
    };
    imports.wbg.__wbg_vertexAttribPointer_7a2a506cdbe3aebc = function(arg0, arg1, arg2, arg3, arg4, arg5, arg6) {
        arg0.vertexAttribPointer(arg1 >>> 0, arg2, arg3 >>> 0, arg4 !== 0, arg5, arg6);
    };
    imports.wbg.__wbg_viewport_a1b4d71297ba89af = function(arg0, arg1, arg2, arg3, arg4) {
        arg0.viewport(arg1, arg2, arg3, arg4);
    };
    imports.wbg.__wbg_viewport_e615e98f676f2d39 = function(arg0, arg1, arg2, arg3, arg4) {
        arg0.viewport(arg1, arg2, arg3, arg4);
    };
    imports.wbg.__wbg_warn_546be8a35b05ef9a = function(arg0, arg1) {
        console.warn(getStringFromWasm0(arg0, arg1));
    };
    imports.wbg.__wbg_width_5dde457d606ba683 = function(arg0) {
        const ret = arg0.width;
        return ret;
    };
    imports.wbg.__wbg_width_cdaf02311c1621d1 = function(arg0) {
        const ret = arg0.width;
        return ret;
    };
    imports.wbg.__wbg_writeBuffer_e63bfcf71f66ec6c = function() { return handleError(function (arg0, arg1, arg2, arg3, arg4, arg5) {
        arg0.writeBuffer(arg1, arg2, arg3, arg4, arg5);
    }, arguments) };
    imports.wbg.__wbg_writeText_51c338e8ae4b85b9 = function(arg0, arg1, arg2) {
        const ret = arg0.writeText(getStringFromWasm0(arg1, arg2));
        return ret;
    };
    imports.wbg.__wbg_writeTexture_2ce8d02c0fabf851 = function() { return handleError(function (arg0, arg1, arg2, arg3, arg4) {
        arg0.writeTexture(arg1, arg2, arg3, arg4);
    }, arguments) };
    imports.wbg.__wbg_write_e357400b06c0ccf5 = function(arg0, arg1) {
        const ret = arg0.write(arg1);
        return ret;
    };
    imports.wbg.__wbindgen_boolean_get = function(arg0) {
        const v = arg0;
        const ret = typeof(v) === 'boolean' ? (v ? 1 : 0) : 2;
        return ret;
    };
    imports.wbg.__wbindgen_cb_drop = function(arg0) {
        const obj = arg0.original;
        if (obj.cnt-- == 1) {
            obj.a = 0;
            return true;
        }
        const ret = false;
        return ret;
    };
    imports.wbg.__wbindgen_closure_wrapper1857 = function(arg0, arg1, arg2) {
        const ret = makeMutClosure(arg0, arg1, 182, __wbg_adapter_34);
        return ret;
    };
    imports.wbg.__wbindgen_closure_wrapper1859 = function(arg0, arg1, arg2) {
        const ret = makeMutClosure(arg0, arg1, 184, __wbg_adapter_37);
        return ret;
    };
    imports.wbg.__wbindgen_closure_wrapper1861 = function(arg0, arg1, arg2) {
        const ret = makeMutClosure(arg0, arg1, 186, __wbg_adapter_40);
        return ret;
    };
    imports.wbg.__wbindgen_closure_wrapper5709 = function(arg0, arg1, arg2) {
        const ret = makeMutClosure(arg0, arg1, 426, __wbg_adapter_43);
        return ret;
    };
    imports.wbg.__wbindgen_closure_wrapper6392 = function(arg0, arg1, arg2) {
        const ret = makeMutClosure(arg0, arg1, 429, __wbg_adapter_46);
        return ret;
    };
    imports.wbg.__wbindgen_debug_string = function(arg0, arg1) {
        const ret = debugString(arg1);
        const ptr1 = passStringToWasm0(ret, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len1 = WASM_VECTOR_LEN;
        getDataViewMemory0().setInt32(arg0 + 4 * 1, len1, true);
        getDataViewMemory0().setInt32(arg0 + 4 * 0, ptr1, true);
    };
    imports.wbg.__wbindgen_in = function(arg0, arg1) {
        const ret = arg0 in arg1;
        return ret;
    };
    imports.wbg.__wbindgen_init_externref_table = function() {
        const table = wasm.__wbindgen_export_1;
        const offset = table.grow(4);
        table.set(0, undefined);
        table.set(offset + 0, undefined);
        table.set(offset + 1, null);
        table.set(offset + 2, true);
        table.set(offset + 3, false);
        ;
    };
    imports.wbg.__wbindgen_is_function = function(arg0) {
        const ret = typeof(arg0) === 'function';
        return ret;
    };
    imports.wbg.__wbindgen_is_object = function(arg0) {
        const val = arg0;
        const ret = typeof(val) === 'object' && val !== null;
        return ret;
    };
    imports.wbg.__wbindgen_is_undefined = function(arg0) {
        const ret = arg0 === undefined;
        return ret;
    };
    imports.wbg.__wbindgen_memory = function() {
        const ret = wasm.memory;
        return ret;
    };
    imports.wbg.__wbindgen_number_get = function(arg0, arg1) {
        const obj = arg1;
        const ret = typeof(obj) === 'number' ? obj : undefined;
        getDataViewMemory0().setFloat64(arg0 + 8 * 1, isLikeNone(ret) ? 0 : ret, true);
        getDataViewMemory0().setInt32(arg0 + 4 * 0, !isLikeNone(ret), true);
    };
    imports.wbg.__wbindgen_number_new = function(arg0) {
        const ret = arg0;
        return ret;
    };
    imports.wbg.__wbindgen_string_get = function(arg0, arg1) {
        const obj = arg1;
        const ret = typeof(obj) === 'string' ? obj : undefined;
        var ptr1 = isLikeNone(ret) ? 0 : passStringToWasm0(ret, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        var len1 = WASM_VECTOR_LEN;
        getDataViewMemory0().setInt32(arg0 + 4 * 1, len1, true);
        getDataViewMemory0().setInt32(arg0 + 4 * 0, ptr1, true);
    };
    imports.wbg.__wbindgen_string_new = function(arg0, arg1) {
        const ret = getStringFromWasm0(arg0, arg1);
        return ret;
    };
    imports.wbg.__wbindgen_throw = function(arg0, arg1) {
        throw new Error(getStringFromWasm0(arg0, arg1));
    };

    return imports;
}

function __wbg_init_memory(imports, memory) {

}

function __wbg_finalize_init(instance, module) {
    wasm = instance.exports;
    __wbg_init.__wbindgen_wasm_module = module;
    cachedDataViewMemory0 = null;
    cachedUint32ArrayMemory0 = null;
    cachedUint8ArrayMemory0 = null;


    wasm.__wbindgen_start();
    return wasm;
}

function initSync(module) {
    if (wasm !== undefined) return wasm;


    if (typeof module !== 'undefined') {
        if (Object.getPrototypeOf(module) === Object.prototype) {
            ({module} = module)
        } else {
            console.warn('using deprecated parameters for `initSync()`; pass a single object instead')
        }
    }

    const imports = __wbg_get_imports();

    __wbg_init_memory(imports);

    if (!(module instanceof WebAssembly.Module)) {
        module = new WebAssembly.Module(module);
    }

    const instance = new WebAssembly.Instance(module, imports);

    return __wbg_finalize_init(instance, module);
}

async function __wbg_init(module_or_path) {
    if (wasm !== undefined) return wasm;


    if (typeof module_or_path !== 'undefined') {
        if (Object.getPrototypeOf(module_or_path) === Object.prototype) {
            ({module_or_path} = module_or_path)
        } else {
            console.warn('using deprecated parameters for the initialization function; pass a single object instead')
        }
    }

    if (typeof module_or_path === 'undefined') {
        module_or_path = new URL('wgputinker_bg.wasm', import.meta.url);
    }
    const imports = __wbg_get_imports();

    if (typeof module_or_path === 'string' || (typeof Request === 'function' && module_or_path instanceof Request) || (typeof URL === 'function' && module_or_path instanceof URL)) {
        module_or_path = fetch(module_or_path);
    }

    __wbg_init_memory(imports);

    const { instance, module } = await __wbg_load(await module_or_path, imports);

    return __wbg_finalize_init(instance, module);
}

export { initSync };
export default __wbg_init;
