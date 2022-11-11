#version 460 core
in vec2 uv;
out vec4 FragColor;

uniform float time;

void main()
{
   FragColor = vec4(uv.x, uv.y, (cos(time) + 1.0) * 0.5, 1.0);
}