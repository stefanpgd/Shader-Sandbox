#include <string>

// Credits to Joey de Vries
// Source: https://learnopengl.com/Getting-started/Shaders

class ShaderProgram
{
public:
	ShaderProgram(const std::string& vertexName, const std::string& fragmentName);
	~ShaderProgram();

	void Bind();

	void SetBool(const std::string& name, bool value) const;
	void SetInt(const std::string& name, int value) const;
	void SetFloat(const std::string& name, float value) const;

	void SetVec2(const std::string& name, float x, float y) const;
	void SetVec3(const std::string& name, float x, float y, float z) const;
private:
	unsigned int shaderProgramID;
};