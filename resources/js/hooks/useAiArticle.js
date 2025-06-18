import { useState } from 'react';

const SYSTEM_PROMPT = `You are an expert technical writer that creates high-quality blog articles. You ONLY respond with clean, well-structured markdown following these strict rules:

FORMATTING RULES:
- Use only: #, ##, ###, paragraphs, lists (-), links, images, code blocks, blockquotes (>)
- Each section should have 2-4 paragraphs
- Images must use this format: ![descriptive alt text](https://via.placeholder.com/800x400?text=Image+Description)
- Code blocks must specify language: \`\`\`javascript
- No HTML tags, no inline styles
- Use consistent heading hierarchy (# for title, ## for main sections, ### for subsections)

CONTENT RULES:
- Include relevant images every 2-3 sections with descriptive alt text
- Add code examples where appropriate
- Write in a clear, engaging tone suitable for developers
- Include practical examples and real-world applications
- Ensure content is accurate and current

STRUCTURE:
- Start with engaging introduction paragraph
- Use clear section headings
- End with a conclusion or next steps
- Include relevant images throughout

When modifying existing content:
- Only change what the user specifically requested
- Maintain the existing structure and style
- Preserve other sections exactly as they are
- Be precise with your modifications`;

export default function useAiArticle() {
    const [isLoading, setIsLoading] = useState(false);

    const generateArticle = async (prompt) => {
        setIsLoading(true);
        try {
            // For now, we'll simulate API call with mock data
            // In production, you'd call your AI service here
            await new Promise(resolve => setTimeout(resolve, 2000)); // Simulate API delay
            
            const mockArticle = generateMockArticle(prompt);
            return mockArticle;
        } catch (error) {
            console.error('Error generating article:', error);
            throw error;
        } finally {
            setIsLoading(false);
        }
    };

    const updateArticle = async (currentContent, userRequest, chatHistory = []) => {
        setIsLoading(true);
        try {
            // For now, we'll simulate API call with mock data
            await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate API delay
            
            const mockUpdate = generateMockUpdate(currentContent, userRequest);
            return mockUpdate;
        } catch (error) {
            console.error('Error updating article:', error);
            throw error;
        } finally {
            setIsLoading(false);
        }
    };

    return {
        generateArticle,
        updateArticle,
        isLoading
    };
}

// Mock functions for demonstration - replace with actual AI service calls
function generateMockArticle(prompt) {
    const topics = {
        'docker': {
            title: 'Getting Started with Docker: A Complete Beginner\'s Guide',
            content: `# Getting Started with Docker: A Complete Beginner's Guide

Docker has revolutionized how we develop, ship, and run applications. Whether you're a beginner developer or looking to modernize your workflow, understanding Docker is essential in today's development landscape.

In this comprehensive guide, we'll walk through everything you need to know to get started with Docker, from basic concepts to practical implementation.

![Docker containers illustration](https://via.placeholder.com/800x400?text=Docker+Containers+Illustration)

## What is Docker?

Docker is a containerization platform that allows you to package applications and their dependencies into lightweight, portable containers. Think of containers as standardized units that include everything needed to run your application: code, runtime, system tools, libraries, and settings.

Unlike traditional virtual machines, Docker containers share the host operating system's kernel, making them much more efficient and faster to start. This approach solves the classic "it works on my machine" problem by ensuring consistent environments across development, testing, and production.

The key benefits of Docker include:
- **Consistency**: Applications run the same way everywhere
- **Portability**: Move containers between different environments easily
- **Efficiency**: Containers use fewer resources than virtual machines
- **Scalability**: Quickly scale applications up or down

## Installing Docker

Getting Docker up and running is straightforward. Here's how to install it on different operating systems:

### Windows and macOS

Download Docker Desktop from the official website. Docker Desktop provides a user-friendly interface and includes everything you need to get started.

\`\`\`bash
# Verify installation
docker --version
docker-compose --version
\`\`\`

### Linux

For Ubuntu/Debian systems, you can install Docker using the package manager:

\`\`\`bash
# Update package index
sudo apt update

# Install Docker
sudo apt install docker.io

# Start Docker service
sudo systemctl start docker
sudo systemctl enable docker

# Add user to docker group (optional)
sudo usermod -aG docker $USER
\`\`\`

![Docker installation process](https://via.placeholder.com/800x400?text=Docker+Installation+Steps)

## Your First Docker Container

Let's start with a simple example. We'll run a basic web server using Docker:

\`\`\`bash
# Pull and run an nginx container
docker run -d -p 8080:80 --name my-nginx nginx

# Visit http://localhost:8080 in your browser
\`\`\`

This command does several things:
- \`pull\`: Downloads the nginx image from Docker Hub
- \`-d\`: Runs the container in detached mode (in the background)
- \`-p 8080:80\`: Maps port 8080 on your host to port 80 in the container
- \`--name my-nginx\`: Gives the container a friendly name

## Essential Docker Commands

Here are the most important Docker commands you'll use daily:

\`\`\`bash
# List running containers
docker ps

# List all containers (including stopped)
docker ps -a

# Stop a container
docker stop my-nginx

# Remove a container
docker rm my-nginx

# List downloaded images
docker images

# Remove an image
docker rmi nginx
\`\`\`

## Creating Your First Dockerfile

A Dockerfile is a text file that contains instructions for building a Docker image. Let's create a simple Node.js application:

\`\`\`dockerfile
# Use official Node.js runtime as base image
FROM node:16-alpine

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy application code
COPY . .

# Expose port 3000
EXPOSE 3000

# Start the application
CMD ["npm", "start"]
\`\`\`

Build and run your custom image:

\`\`\`bash
# Build the image
docker build -t my-node-app .

# Run the container
docker run -p 3000:3000 my-node-app
\`\`\`

![Dockerfile structure diagram](https://via.placeholder.com/800x400?text=Dockerfile+Structure+Diagram)

## Best Practices

As you start working with Docker, keep these best practices in mind:

**Use Official Images**: Start with official images from Docker Hub when possible. They're maintained, secure, and optimized.

**Minimize Image Size**: Use alpine versions of base images and remove unnecessary packages to keep images small and secure.

**Layer Caching**: Order Dockerfile instructions to maximize caching. Put commands that change less frequently earlier in the file.

**Security**: Never include secrets in your images. Use environment variables or Docker secrets for sensitive data.

## Next Steps

Now that you understand Docker basics, you're ready to explore more advanced topics:

- **Docker Compose**: Manage multi-container applications
- **Docker Volumes**: Persist data between container restarts
- **Docker Networks**: Connect containers securely
- **Container Orchestration**: Scale applications with Kubernetes

Docker opens up a world of possibilities for modern application development. Start experimenting with containerizing your own projects and experience the benefits firsthand.

Remember, the best way to learn Docker is by doing. Try containerizing a simple application you've built and see how Docker can streamline your development workflow.`,
            excerpt: 'Learn Docker from scratch with this comprehensive beginner\'s guide. Covers installation, basic commands, Dockerfile creation, and best practices.'
        },
        'react': {
            title: 'Setting Up a Modern React Development Environment',
            content: `# Setting Up a Modern React Development Environment

Setting up an efficient React development environment is crucial for productive development. This guide will walk you through creating a modern, optimized setup that includes all the essential tools and configurations.

We'll cover everything from initial setup to advanced tooling that will make your React development experience smooth and enjoyable.

![React development environment](https://via.placeholder.com/800x400?text=React+Development+Environment)

## Prerequisites

Before we begin, make sure you have Node.js installed on your system. React requires Node.js version 14 or higher.

\`\`\`bash
# Check Node.js version
node --version

# Check npm version
npm --version
\`\`\`

If you don't have Node.js installed, download it from the official website or use a version manager like nvm for better version control.

## Creating Your React Project

The easiest way to start a new React project is using Create React App, which sets up a modern build pipeline with zero configuration:

\`\`\`bash
# Create a new React app
npx create-react-app my-react-app

# Navigate to the project directory
cd my-react-app

# Start the development server
npm start
\`\`\`

This creates a project with a modern build setup including hot reloading, error overlays, and optimized production builds.

## Essential Development Tools

### Code Editor Setup

Visual Studio Code is the most popular choice for React development. Install these essential extensions:

- **ES7+ React/Redux/React-Native snippets**: Provides useful code snippets
- **Prettier**: Automatic code formatting
- **ESLint**: Code linting and error detection
- **Auto Rename Tag**: Automatically renames paired HTML/JSX tags

### Browser Developer Tools

Install the React Developer Tools extension for Chrome or Firefox. This provides powerful debugging capabilities specific to React applications.

![React Developer Tools](https://via.placeholder.com/800x400?text=React+Developer+Tools)

## Project Structure

A well-organized project structure is essential for maintainability:

\`\`\`
src/
├── components/
│   ├── common/
│   └── pages/
├── hooks/
├── services/
├── utils/
├── styles/
└── assets/
\`\`\`

This structure separates concerns and makes your codebase easier to navigate as it grows.

## Adding Essential Dependencies

Here are some libraries that will enhance your React development experience:

\`\`\`bash
# State management
npm install @reduxjs/toolkit react-redux

# Routing
npm install react-router-dom

# HTTP client
npm install axios

# UI components
npm install @mui/material @emotion/react @emotion/styled

# Form handling
npm install react-hook-form
\`\`\`

## Environment Configuration

Create environment-specific configuration files:

\`\`\`.env.development
REACT_APP_API_URL=http://localhost:3001/api
REACT_APP_DEBUG=true
\`\`\`

\`\`\`.env.production
REACT_APP_API_URL=https://api.yourapp.com
REACT_APP_DEBUG=false
\`\`\`

## Testing Setup

React comes with Jest and React Testing Library pre-configured. Create your first test:

\`\`\`javascript
import { render, screen } from '@testing-library/react';
import App from './App';

test('renders learn react link', () => {
  render(<App />);
  const linkElement = screen.getByText(/learn react/i);
  expect(linkElement).toBeInTheDocument();
});
\`\`\`

## Performance Optimization

### Code Splitting

Implement route-based code splitting for better performance:

\`\`\`javascript
import { lazy, Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';

const Home = lazy(() => import('./components/pages/Home'));
const About = lazy(() => import('./components/pages/About'));

function App() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
      </Routes>
    </Suspense>
  );
}
\`\`\`

### Bundle Analysis

Analyze your bundle size to identify optimization opportunities:

\`\`\`bash
# Install bundle analyzer
npm install --save-dev webpack-bundle-analyzer

# Add script to package.json
"analyze": "npm run build && npx webpack-bundle-analyzer build/static/js/*.js"
\`\`\`

![Bundle analyzer visualization](https://via.placeholder.com/800x400?text=Bundle+Analyzer+Visualization)

## Deployment

### Building for Production

\`\`\`bash
# Create optimized production build
npm run build
\`\`\`

### Deployment Options

- **Netlify**: Simple drag-and-drop deployment
- **Vercel**: Optimized for React applications
- **AWS S3 + CloudFront**: Scalable hosting solution
- **GitHub Pages**: Free hosting for open source projects

## Advanced Configuration

### Custom Webpack Configuration

If you need more control over the build process, you can eject from Create React App or use CRACO (Create React App Configuration Override):

\`\`\`bash
npm install @craco/craco
\`\`\`

Create a \`craco.config.js\` file for custom configurations without ejecting.

## Conclusion

You now have a solid foundation for React development. This setup provides:
- Fast development with hot reloading
- Code quality tools
- Testing capabilities
- Performance optimization
- Flexible deployment options

Start building your React applications with confidence, knowing you have a professional development environment that will scale with your projects.

Remember to keep your dependencies updated and stay informed about React ecosystem changes to maintain an optimal development experience.`,
            excerpt: 'Complete guide to setting up a modern React development environment with essential tools, best practices, and optimization techniques.'
        }
    };

    // Determine topic from prompt
    const lowerPrompt = prompt.toLowerCase();
    if (lowerPrompt.includes('docker')) {
        return topics.docker;
    } else if (lowerPrompt.includes('react')) {
        return topics.react;
    }

    // Default generic article
    return {
        title: 'Your Article Title Will Appear Here',
        content: `# Your Article Title Will Appear Here

This is where your article content will appear. The AI will generate a complete, well-structured article based on your description.

![Placeholder image](https://via.placeholder.com/800x400?text=Your+Article+Image)

## Section 1

Your article will include multiple sections with clear headings, engaging content, and relevant examples.

## Section 2

Each section will contain 2-4 paragraphs of high-quality content tailored to your specific topic and requirements.

\`\`\`javascript
// Code examples will be included where appropriate
console.log('Hello, World!');
\`\`\`

## Conclusion

The AI will create a comprehensive article that follows best practices for technical writing and includes all the elements you requested.`,
        excerpt: 'A comprehensive article generated by AI based on your specifications.'
    };
}

function generateMockUpdate(currentContent, userRequest) {
    // Simple mock update logic
    const lowerRequest = userRequest.toLowerCase();
    
    if (lowerRequest.includes('intro') || lowerRequest.includes('introduction')) {
        return {
            content: currentContent.replace(
                /^(# .+\n\n)([^#]+)/,
                '$1This updated introduction is more engaging and compelling, drawing readers in with improved clarity and flow. We\'ve enhanced the opening to better communicate the value proposition and what readers will gain from this article.\n\n'
            ),
            explanation: 'I\'ve made the introduction more engaging and compelling!'
        };
    }

    if (lowerRequest.includes('code example') || lowerRequest.includes('example')) {
        return {
            content: currentContent + `\n\n## Code Example\n\nHere's a practical example to illustrate the concepts:\n\n\`\`\`javascript\n// Example implementation\nconst example = {\n  title: "Practical Example",\n  description: "This shows how to apply the concepts"\n};\n\nconsole.log(example);\n\`\`\`\n\nThis example demonstrates the practical application of the concepts we've discussed.`,
            explanation: 'I\'ve added a practical code example to help illustrate the concepts!'
        };
    }

    if (lowerRequest.includes('image') || lowerRequest.includes('replace')) {
        // Mock image replacement
        return {
            content: currentContent.replace(
                /!\[([^\]]*)\]\([^)]+\)/,
                '![Updated image description](https://via.placeholder.com/800x400?text=New+Updated+Image)'
            ),
            explanation: 'I\'ve replaced the image with a new one based on your description!'
        };
    }

    // Default update
    return {
        content: currentContent + `\n\n## Additional Section\n\nI've added this new section based on your request. This content expands on the existing article with relevant information and maintains the same tone and structure.\n\nThe new content integrates seamlessly with the existing article while addressing your specific requirements.`,
        explanation: 'I\'ve updated the article based on your request!'
    };
}