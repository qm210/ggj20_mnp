---
name: glitch
type: fragment
uniform.amount: { "type": "1f", "value": 0.0 }
---

precision mediump float;

uniform float time;
uniform vec2 resolution;
uniform vec2 mouse;
uniform float amount;

// float amount = .5;

const vec3 c = vec3(1.,0.,-1.);

void rand(in vec2 x, out float n)
{
    x += 400.;
    n = fract(sin(dot(sign(x)*abs(x) ,vec2(12.9898,78.233)))*43758.5453);
}

// Creative Commons Attribution-ShareAlike 4.0 International Public License
// Created by David Hoskins.
// See https://www.shadertoy.com/view/4djSRW
void hash32(in vec2 p, out vec3 d)
{
	vec3 p3 = fract(vec3(p.xyx) * vec3(.1031, .1030, .0973));
    p3 += dot(p3, p3.yxz+33.33);
    d = fract((p3.xxy+p3.yzz)*p3.zyx);
}
// End of CCA-SA 4.0

void lfnoise(in vec2 t, out float n)
{
    vec2 i = floor(t);
    t = fract(t);
    t = smoothstep(c.yy, c.xx, t);
    vec2 v1, v2;
    rand(i, v1.x);
    rand(i+c.xy, v1.y);
    rand(i+c.yx, v2.x);
    rand(i+c.xx, v2.y);
    v1 = c.zz+2.*mix(v1, v2, t.y);
    n = mix(v1.x, v1.y, t.x);
}

void dbox(in vec2 x, in vec2 b, out float d)
{
    vec2 da = abs(x)-b;
    d = length(max(da,c.yy)) + min(max(da.x,da.y),0.0);
}

float sm(in float d)
{
    return smoothstep(1.5/resolution.y, -1.5/resolution.y, d);
}

void main()
{
    vec2 uv = (gl_FragCoord.xy-.5*resolution)/resolution.y;
    gl_FragColor = c.yyyy;
    
    float d, n, da;
    for(float i=0.; i<12.; i+=1.)
    {
        float n;
        lfnoise(i*c.xx-4.*time, n);
        float size;
        rand(i*c.xx, size);
        size *= .1-.01*i;
        vec2 x = mod(uv, size)-.5*size,
            xi = (uv-x)/size;
        vec3 ri, col;
        hash32(xi, ri);
        dbox(x, (ri.xy-.5)*size, da);
        
        hash32(xi+i*1.e3, col);
        if(ri.z > (1.2-amount)+.2*n)
            gl_FragColor = mix(gl_FragColor, mix(gl_FragColor, vec4(col, 1.), .7), sm(d));
    }
}
