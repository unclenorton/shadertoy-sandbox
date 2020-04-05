// Based off https://www.shadertoy.com/view/4tXSRM

#define MAX_DEPTH 20
#define PI 3.14159265359
#define TWO_PI 6.28318530718

// Courtesy of http://www.science-and-fiction.org/rendering/noise.html
float noise(vec2 p) {
	return fract(sin(dot(p.xy ,vec2(12.9898,78.233))) * 456367.5453);
}

float getTriangle(vec2 p, vec2 rp){
    p *= vec2(iResolution.x, iResolution.y);
    p /= max(iResolution.x, iResolution.y);
    
    p -= rp;

    vec3 color = vec3(0.0);
    float d = 0.0;

    // Remap the space to -1. to 1.
    p = p * 2. - 1.;

    // Number of sides of your shape
    int N = 2 + int(floor(abs(cos(iTime) * 10.)/2.));

    // Angle and radius from the current pixel
    float a = atan(p.x,p.y)+PI;
    float r = TWO_PI/float(N);

    // Shaping function that modulate the distance
    d = cos(floor(.5+a/r)*r-a)*length(p);

    return smoothstep(.15,d,0.)-smoothstep(.145,d, 0.);
}

void mainImage(out vec4 fragColor, in vec2 fragCoord) {
    // Scale coordinates to [0, 1]
	vec2 p = fragCoord.xy / iResolution.xy;
    
    vec3 vCol = vec3(0.);
    // Start from the back buildings and work forward, so buildings in the front cover the ones in the back
	for (int i = 1; i < MAX_DEPTH; i++) {
        // This is really "inverse" depth since we start from the back
		float depth = float(i);
        
        // Create a step function where the width of each step is constant at each depth, but increases as
        // the depth increases (as we move forward). We will get the same step value for multiple p.x
        // values, which will give our building width. iTime creates the scrolling effect.
		float step = floor(400. * p.x / depth + 100. * depth + iTime);
        
        // Use the noise function to get the y coordinate of the top of the building, and decrease this
        // height the closer we are to the front. If our pixel is below this height, we set its color
        // depending on it's depth. 
        float threshold = noise(vec2(step)) - depth * .04;
		if (p.y <= threshold) {
            if (threshold - p.y < 0.001) {
                // Draw the lights on top
                vCol = vec3(1., 0.9, 0.2) * noise(vec2(p.y));
            } else {
                // Generate a randomised base color
                vec3 randomColor = vec3(noise(vec2(step / 50.))*.7, 0.1, noise(vec2(step / 10.))*1.25);
                // Apply the color as a gradient
				vCol = randomColor * vec3(depth / 6. * p.y) * noise(vec2(step));
            }
		}

        if (i == 7) {
            vec3 triangle = getTriangle(p, vec2(0.0, 0.03 + sin(iTime)/10.)) * vec3(2.0, 30.0, 2.0) * 2.0;
            vCol += vec3(triangle);
        }
	}
    
    //fragColor = vec4(vCol, 1.);
    fragColor = vec4(vCol.x, vCol.y, vCol.z, 1.);
    
}