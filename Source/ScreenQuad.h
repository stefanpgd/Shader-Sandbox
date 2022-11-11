#pragma once

// Class that creates the quad that will be used to draw to
class ScreenQuad
{
public:
	ScreenQuad();

	void Render();

private:
	unsigned int VBO, VAO, EBO;

	float quadData[24] {
		1.0f,  1.0f, 0.0f,	1.0f, 1.0f,
		1.0f, -1.0f, 0.0f,	1.0f, 0.0f,
	   -1.0f, -1.0f, 0.0f,	0.0f, 0.0f,
	   -1.0f,  1.0f, 0.0f,	0.0f, 1.0f
	};

	unsigned int indices[6] {  
	0, 1, 3,   
	1, 2, 3    
	};
};