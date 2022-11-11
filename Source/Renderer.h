#pragma once
#include <string>
#include <glad/glad.h>
#include <GLFW/glfw3.h>

class Renderer
{
public:
	Renderer();

	void Run();

private:
	bool isRunning = true;
	unsigned int windowWidth = 1080;
	unsigned int windowHeight = 720;

	GLFWwindow* window = nullptr;

	void StartFrame();
	void Update(float deltaTime);
	void Render();

	void ProcessInput(GLFWwindow* window);
};