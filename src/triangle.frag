// Based on https://www.shadertoy.com/view/lsBfRc

#define PI 3.14159265359
#define TWO_PI 6.28318530718

float getTriangle(vec2 p, vec2 rp) {
    p -= rp;

    vec3 color = vec3(0.0);
    float d = 0.0;

    // Remap the space to -1. to 1.
    // p = p * 2. - 1.;

    // Number of sides of your shape
    int N = 6;

    // Angle and radius from the current pixel
    float a = atan(p.x,p.y)+PI - iTime;
    float r = TWO_PI/float(N);

    // Shaping function that modulate the distance
    d = cos(floor(sin(iTime)+a/r)*r-a)*length(p);

    return smoothstep(.15,d,0.)-smoothstep(.145,d, 0.);
}

void mainImage(out vec4 fragColor, in vec2 fragCoord) {
    // create pixel coordinates
	vec2 uv = fragCoord.xy / iResolution.xy;
    vec2 ctr = uv - vec2(0.5,0.65);
    // Make it a circle by applying the aspect ratio
    ctr.x *= iResolution.x / iResolution.y;

    float triangle = getTriangle(ctr, vec2(0.0, -0.25 + sin(iTime)/10.));
    fragColor = vec4(triangle);
}