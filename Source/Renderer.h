#pragma once
#include <string>
#include <glad/glad.h>
#include <GLFW/glfw3.h>

class ShaderProgram;
class ScreenQuad;

class Renderer
{
public:
	Renderer();

	void Run();

private:
	void StartFrame();
	void Update(float deltaTime);
	void Render();

	void ProcessInput(GLFWwindow* window);

private:
	bool isRunning = true;
	float elaspedTime = 0.0f;
	unsigned int windowWidth = 1080;
	unsigned int windowHeight = 720;

	GLFWwindow* window = nullptr;
	ShaderProgram* shader;
	ScreenQuad* screenQuad;
};