// Based off https://www.shadertoy.com/view/4tXSRM

#iChannel0 "file://peaks.frag"
#iChannel1 "file://triangle.frag"

#define MAX_DEPTH 20

// Courtesy of http://www.science-and-fiction.org/rendering/noise.html
float noise(vec2 p) {
	return fract(sin(dot(p.xy ,vec2(12.9898,78.233))) * 456367.5453);
}

void mainImage(out vec4 fragColor, in vec2 fragCoord) {
    // Scale coordinates to [0, 1]
	vec2 p = fragCoord.xy / iResolution.xy;
    
    vec4 vCol = vec4(0.);
    vec4 peaks = vec4(1.);
    
    // Start from the back buildings and work forward, so buildings in the front cover the ones in the back
    
    int shootingLevel = int(floor(noise(vec2(float(iFrame))) * float(MAX_DEPTH)));
    
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
                vCol = vec4(1., 0.9, 0.2, 1.0) * noise(vec2(p.y));
            } else {
                // Generate a randomised base color
                vec4 randomColor = vec4(noise(vec2(step / 50.))*.7, 0.1, noise(vec2(step / 10.))*1.25, 1.0);
                // Apply the color as a gradient
				vCol = randomColor * vec4(depth / 6. * p.y) * noise(vec2(step));
            }
		}

        if (i == 7) {
            vec4 triangle = texelFetch(iChannel1, ivec2(fragCoord),0);
            vCol += vec4(triangle);
        }
        
        if (i == shootingLevel + 1) {
        	peaks = texelFetch(iChannel0, ivec2(fragCoord),0);
        	vCol += vec4(peaks.x, peaks.y * noise(vec2(step/10.)), peaks.z * 0.15, 0.);
        }
	}
    
    //fragColor = vec4(vCol, 1.);
    fragColor = vec4(vCol.x, vCol.y, vCol.z, 1.);
    
}