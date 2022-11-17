#version 460 core
in vec2 uv;
out vec4 FragColor;
uniform float time;
uniform vec2 resolution;

const int MAX_MARCHING_STEPS = 500;
const float MIN_DIST = 0.0;
const float MAX_DIST = 5000.0;
const float EPSILON = 0.001;

int steps = 0;

float sdOctahedron( vec3 p, float s)
{
  p = abs(p);
  return (p.x+p.y+p.z-s)*0.57735027;
}

float SDFSphere(vec3 p, float radius) 
{
    return length(p) - radius;
}

float shortestDistanceToSurface(vec3 eye, vec3 marchingDirection, float start, float end) {
    float depth = start;
    for (int i = 0; i < MAX_MARCHING_STEPS; i++) {
        float dist = SDFSphere(eye + depth * marchingDirection, 0.25);
        if (dist < EPSILON) {
			return depth;
        }
        depth += dist;

        if(dist <= 50){
            steps += 1;
        }

        if (depth >= end) {
            return end;
        }
    }
    return end;
}

vec3 rayDirection(float fieldOfView, vec2 size, vec2 fragCoord) {
    vec2 xy = fragCoord - size / 2.0;
    float z = size.y / tan(radians(fieldOfView) / 2.0);
    return normalize(vec3(xy, -z));
}

void main()
{
    vec3 dir = rayDirection(45.0, resolution, gl_FragCoord.xy);
    vec3 eye = vec3(cos(time) * 0.5, sin(time) * 0.5,5);
    float dist = shortestDistanceToSurface(eye, dir, MIN_DIST, MAX_DIST);
    
    if (dist > MAX_DIST - EPSILON) {
        FragColor = vec4(0.015 * steps, 0.1, 0.1, 1.0);
		return;
    }
    
    vec3 color = vec3(0.1, 0.1, 0.1);
    FragColor = vec4(color, 1.0);
}