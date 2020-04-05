// Based on https://www.shadertoy.com/view/4djBDR

#iChannel0 "self"

void mainImage( out vec4 f, vec2 g )
{
    f.xyz = iResolution;
    vec2 v = (g+g-f.xy)/f.y*10.;
    f *= texture(iChannel0, g/f.xy) / length(f);
    g = vec2(iFrame/50 + 10, iFrame/5);
    g = v - sin(g) * fract(iTime*.1 + 10.*sin(g))*50.;
    f += .05 / max(abs(g.x), g.y);
}