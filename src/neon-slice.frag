float circleShape (vec2 position, float innerRadius, float outerRadius) {
    float thickness = outerRadius - innerRadius;
    
    return smoothstep(innerRadius, outerRadius, length(position)) 
        - smoothstep(outerRadius, outerRadius + thickness, length(position));
}

float diskShape (vec2 position, float radius) {
    return smoothstep(radius, radius+0.01, length(position));
}

// Courtesy of http://www.science-and-fiction.org/rendering/noise.html
float rand(vec2 co){
    return fract(sin(dot(co.xy ,vec2(12.9898,78.233))) * 43758.5453);
}

void mainImage( out vec4 fragColor, in vec2 fragCoord )
{
    vec2 xy = fragCoord.xy;
    
    // create pixel coordinates
	vec2 uv = fragCoord.xy / iResolution.xy;
    
    vec4 pic = texture(iChannel1,uv);
    
    vec2 ctr = uv - vec2(0.5,0.5);
    // Make it a circle by applying the aspect ratio
    ctr.x *= iResolution.x / iResolution.y;

    // the sound texture is 512x2
    int tx = int(uv.x*512.0);
    
	// first row is frequency data (48Khz/4 in 512 texels, meaning 23 Hz per texel)
	float fft  = texelFetch( iChannel0, ivec2(tx,0), 0 ).x; 

    // second row is the sound wave, one texel is one mono sample
    float wave = texelFetch( iChannel0, ivec2(tx,1), 0 ).x;
    
    
    
    // Draw the lines
 	vec4 fillColor = vec4(0.5,0.5,0.5,1.0);
    
    float diagonal = (sqrt(pow(iResolution.x, 2.) + pow(iResolution.y, 2.)));

    float gradientRed = round(cos(wave * 0.8 + 100. * (xy.x + xy.y) / diagonal ));
    float gradientBlue = smoothstep(0.5, 0.6, (sin(1000. * (xy.x - xy.y) / diagonal)));

    fillColor.r = abs(cos(gradientRed + iTime));
    
    fillColor.g = abs(cos(gradientBlue + iTime)) / 1.5;
    fillColor.b = ((cos(gradientBlue + iTime)));

    // Switch to monochrome
    // fillColor.g = fillColor.b = fillColor.r;
    
    // Draw the circle
    float innerRadius = rand(vec2(100.0, iTime))/ 300.0 + 0.3 + (sin(iTime * .5)) / 40.0;
    innerRadius += wave/10.00;
    
    float outerRadius = innerRadius + 0.005;
    fillColor -= sign(sin(iTime)) * circleShape(ctr, innerRadius, outerRadius);
    
    float diskColor = diskShape(ctr, innerRadius);
    
    
    fillColor /= diskColor;
    
    
    fragColor = fillColor;
}