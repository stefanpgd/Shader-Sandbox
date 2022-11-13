#version 460 core
in vec2 uv;
out vec4 FragColor;
uniform float time;
uniform vec2 resolution;

const int MAX_MARCHING_STEPS = 255;
const float MIN_DIST = 0.0;
const float MAX_DIST = 100.0;
const float EPSILON = 0.0001;

struct HitInfo 
{
    vec3 point;
    float dist;
    vec3 color;

} Hit;

float sdfCircle(vec3 p, vec3 position, float radius) 
{
    return length(position - p) - radius;
}

float sdfBox(vec3 p, vec3 position, vec3 size) 
{
    vec3 q = abs(position - p) - size;
    return length(max(q,0.0)) + min(max(q.x,max(q.y,q.z)),0.0);
}

float smoothMin(float a, float b, float k) {
    float h = max(k - abs(a-b), 0) / k;
    return min(a,b) - h*h*h*k*1/6.0;
}

float smoothMax(float a, float b, float k) {
    float h = min(k - abs(a-b), 0) / k;
    return max(a,b) - h*h*h*k*1/6.0;
}

float sdfScene(vec3 p) 
{
    HitInfo hit;

    float circle =  sdfCircle(p, vec3(0.0, (cos(time) + 0.5) * 1.15, 0.0), 0.5);
    float box = sdfBox(p, vec3(0.0, -0.5, 0.0), vec3(2, 1, 1));

    return smoothMin(box, circle, 1);
}

float shortestDistanceToSurface(vec3 eye, vec3 marchingDirection, float start, float end) {
    float depth = start;
    for (int i = 0; i < MAX_MARCHING_STEPS; i++) {
        float dist = sdfScene(eye + depth * marchingDirection);
        if (dist < EPSILON) {
			return depth;
        }
        depth += dist;
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
    vec3 eye = vec3(0, 1, 5);
    float dist = shortestDistanceToSurface(eye, dir, MIN_DIST, MAX_DIST);
    
    if (dist > MAX_DIST - EPSILON) {
        FragColor = vec4(0.0, 0.0, 0.0, 0.0);
		return;
    }
    
    vec3 point = eye + dist * dir;
    vec3 lightDir = vec3(0.0, -0.6, -0.1);
    lightDir = normalize(lightDir);
    float diffStrength = dot(normalize(point), -lightDir);
    vec3 color = vec3(uv.x, uv.y, 0) * diffStrength * 2.5;
    FragColor = vec4(color, 1.0);
}