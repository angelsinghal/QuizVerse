const { OpenAI } = require('openai');
const pdfParse = require('pdf-parse');
const fs = require('fs');

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

// Process PDF and extract quiz questions
exports.processPdfQuiz = async (filePath) => {
  try {
    // Read PDF file
    const dataBuffer = fs.readFileSync(filePath);
    const data = await pdfParse(dataBuffer);
    
    // Extract text content
    const pdfText = data.text;
    
    // Use OpenAI to extract and format quiz questions
    const response = await openai.chat.completions.create({
      model: "gpt-4-turbo",
      messages: [
        {
          role: "system",
          content: "You are a helpful assistant that extracts quiz questions from PDF content. Format the output as a JSON array of question objects. Each question object should have a 'question', 'options' (array of strings), and 'correctAnswer' (index of the correct option)."
        },
        {
          role: "user",
          content: `Extract quiz questions from the following PDF content and format them as requested:\n\n${pdfText}`
        }
      ],
      response_format: { type: "json_object" }
    });
    
    // Parse the AI response
    const formattedQuestions = JSON.parse(response.choices[0].message.content);
    
    return formattedQuestions.questions;
  } catch (error) {
    console.error('Error processing PDF quiz:', error);
    throw new Error('Failed to process PDF and extract quiz questions');
  }
};

// Generate quiz questions based on a topic
exports.generateQuiz = async (topic, difficulty, numQuestions) => {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4-turbo",
      messages: [
        {
          role: "system",
          content: "You are a quiz generator assistant. Create a quiz with multiple-choice questions based on the given topic, difficulty, and number of questions. Format the output as a JSON array of question objects."
        },
        {
          role: "user",
          content: `Generate a ${difficulty} level quiz about "${topic}" with ${numQuestions} multiple-choice questions. Each question should have 4 options with one correct answer.`
        }
      ],
      response_format: { type: "json_object" }
    });
    
    // Parse the AI response
    const generatedQuiz = JSON.parse(response.choices[0].message.content);
    
    return generatedQuiz.questions;
  } catch (error) {
    console.error('Error generating quiz:', error);
    throw new Error('Failed to generate quiz questions');
  }
};