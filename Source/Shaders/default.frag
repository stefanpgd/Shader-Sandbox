#version 460 core
in vec2 uv;
out vec4 FragColor;
uniform float time;
uniform vec2 resolution;

const int MAX_MARCHING_STEPS = 1000;
const float MIN_DIST = 0.0;
const float MAX_DIST = 10000.0;
const float EPSILON = 0.0001;

float sdfCircle(vec3 p, vec3 position, float radius) 
{
    return length(position - p) - radius;
}

float circle(vec3 p, float radius) 
{
    return length(p) - radius;
}

float repCircle(vec3 p, vec3 offset, float radius) {
    vec3 q = mod(p + 0.5 * offset, offset) - 0.5 * offset;
    return circle(q, radius);
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
    float circle2 =  repCircle(p, vec3(3 + cos(time) * 0.5, 2, 3), 0.005 + sin(time) * 0.003);
    float circle3 =  repCircle(p, vec3(3.5, 3.5, 3.5), 0.0025);

    float c = smoothMin(circle2, circle3, ((cos(time / 6) + 1) * 0.5) * 7);
    return c;
}

vec3 estimateNormal(vec3 p) {
    return normalize(vec3(
        sdfScene(vec3(p.x + EPSILON, p.y, p.z)) - sdfScene(vec3(p.x - EPSILON, p.y, p.z)),
        sdfScene(vec3(p.x, p.y + EPSILON, p.z)) - sdfScene(vec3(p.x, p.y - EPSILON, p.z)),
        sdfScene(vec3(p.x, p.y, p.z  + EPSILON)) - sdfScene(vec3(p.x, p.y, p.z - EPSILON))
    ));
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
    vec3 eye = vec3(cos(time) * 1.5, sin(time) * 1.5, -time * 25);
    float dist = shortestDistanceToSurface(eye, dir, MIN_DIST, MAX_DIST);
    
    if (dist > MAX_DIST - EPSILON) {
        FragColor = vec4(0.2, 0.2, 1.0, 1.0);
		return;
    }
    
    vec3 point = eye + dist * dir;
    vec3 normal = estimateNormal(point);
    vec3 lightDir = vec3(0.3, -0.8, -0.0);
    lightDir = normalize(lightDir);
    float diffStrength = dot(normal, -lightDir);

    vec3 color = mix(vec3(0.2, 0.9, 0.157), vec3(1.0, 1.0, 1.0), (cos(time) + 1.0) * 0.5);
    float depth = gl_FragCoord.z / gl_FragCoord.w;

    FragColor = vec4(color, 1.0) * 1.0 / dist * (30 * (cos(time / 2) + 1.0) * 0.5 + 0.5);
}