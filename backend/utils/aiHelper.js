const axios = require('axios');

/**
 * Analyze medical document using Hugging Face AI
 * Using a more reliable text generation model
 */
const analyzeMedicalDocument = async (documentContext) => {
  try {
    console.log('🤖 Calling Hugging Face API...');
    
    // Create a structured prompt
    const prompt = `Medical Document Analysis:

Document Type: ${documentContext.category}
Title: ${documentContext.title}
${documentContext.description ? `Description: ${documentContext.description}` : ''}
${documentContext.doctorName ? `Doctor: ${documentContext.doctorName}` : ''}
${documentContext.hospitalName ? `Hospital: ${documentContext.hospitalName}` : ''}

Task: Provide a brief, patient-friendly summary of this medical document. Focus on:
1. What type of document this is
2. Any key health information that would be important for the patient
3. Any follow-up actions needed

Summary:`;

    console.log('📝 Prompt created, sending to API...');

    // Using Hugging Face's Inference API with a reliable model
    const response = await axios.post(
      'https://api-inference.huggingface.co/models/google/flan-t5-base',
      {
        inputs: prompt,
        parameters: {
          max_new_tokens: 200,
          temperature: 0.7,
          top_p: 0.9
        }
      },
      {
        headers: {
          'Authorization': `Bearer ${process.env.HUGGINGFACE_API_KEY}`,
          'Content-Type': 'application/json'
        },
        timeout: 30000 // 30 seconds
      }
    );

    console.log('✅ API Response received:', response.status);

    // Handle different response formats
    let aiText = '';
    
    if (Array.isArray(response.data)) {
      aiText = response.data[0]?.generated_text || '';
    } else if (response.data.generated_text) {
      aiText = response.data.generated_text;
    } else {
      console.log('Unexpected response format:', response.data);
      aiText = JSON.stringify(response.data);
    }

    console.log('🎯 Generated text:', aiText.substring(0, 100) + '...');

    // Create a structured summary
    const summary = createStructuredSummary(documentContext, aiText);
    
    return {
      success: true,
      summary: summary,
      rawResponse: aiText
    };

  } catch (error) {
    console.error('❌ AI Analysis Error:', error.message);
    
    if (error.response) {
      console.error('API Error Status:', error.response.status);
      console.error('API Error Data:', error.response.data);
    }
    
    // Return a smart fallback based on document info
    return {
      success: false,
      error: error.message,
      summary: createFallbackSummary(documentContext)
    };
  }
};

/**
 * Create structured summary from AI response
 */
const createStructuredSummary = (documentContext, aiText) => {
  const summary = {
    simpleSummary: '',
    keyFindings: [],
    medications: [],
    instructions: []
  };

  // If AI generated good text, use it
  if (aiText && aiText.length > 20) {
    summary.simpleSummary = aiText.trim();
  } else {
    // Use document info to create summary
    summary.simpleSummary = `This is a ${documentContext.category.toLowerCase()} titled "${documentContext.title}". `;
    
    if (documentContext.description) {
      summary.simpleSummary += documentContext.description + ' ';
    }
    
    if (documentContext.doctorName) {
      summary.simpleSummary += `Provided by Dr. ${documentContext.doctorName}. `;
    }
  }

  // Extract key findings based on category
  switch (documentContext.category) {
    case 'Lab Report':
      summary.keyFindings.push('Laboratory test results documented');
      summary.instructions.push('Review results with your doctor');
      break;
    case 'Prescription':
      summary.keyFindings.push('Medication prescription provided');
      summary.instructions.push('Follow dosage instructions carefully');
      summary.instructions.push('Consult doctor if side effects occur');
      break;
    case 'X-Ray':
    case 'MRI':
    case 'CT Scan':
      summary.keyFindings.push('Imaging study completed');
      summary.instructions.push('Discuss results with your doctor');
      break;
    case 'Consultation':
      summary.keyFindings.push('Medical consultation documented');
      break;
  }

  return summary;
};

/**
 * Create fallback summary when AI fails
 */
const createFallbackSummary = (documentContext) => {
  const summary = {
    simpleSummary: '',
    keyFindings: [],
    medications: [],
    instructions: []
  };

  // Create a meaningful summary from available data
  summary.simpleSummary = `This is your ${documentContext.category.toLowerCase()} `;
  
  if (documentContext.title) {
    summary.simpleSummary += `titled "${documentContext.title}". `;
  }
  
  if (documentContext.description) {
    summary.simpleSummary += documentContext.description + ' ';
  } else {
    summary.simpleSummary += 'documenting your medical information. ';
  }
  
  if (documentContext.doctorName) {
    summary.simpleSummary += `This was provided by Dr. ${documentContext.doctorName}`;
    if (documentContext.hospitalName) {
      summary.simpleSummary += ` from ${documentContext.hospitalName}`;
    }
    summary.simpleSummary += '. ';
  }

  summary.simpleSummary += 'Please review the original document for complete details.';

  // Add category-specific guidance
  switch (documentContext.category) {
    case 'Lab Report':
      summary.keyFindings.push('Contains laboratory test results');
      summary.instructions.push('Review with your healthcare provider');
      summary.instructions.push('Keep for your medical records');
      break;
      
    case 'Prescription':
      summary.keyFindings.push('Contains medication information');
      summary.instructions.push('Take medications as prescribed');
      summary.instructions.push('Note any side effects');
      summary.instructions.push('Keep track of refill dates');
      break;
      
    case 'X-Ray':
    case 'MRI':
    case 'CT Scan':
      summary.keyFindings.push('Imaging study results available');
      summary.instructions.push('Discuss findings with your doctor');
      summary.instructions.push('Bring to follow-up appointments');
      break;
      
    case 'Consultation':
      summary.keyFindings.push('Doctor consultation notes');
      summary.instructions.push('Follow recommended care plan');
      summary.instructions.push('Schedule follow-up if advised');
      break;
      
    default:
      summary.instructions.push('Keep this document in your medical records');
  }

  return summary;
};

/**
 * Main function to analyze medical record
 */
const analyzeMedicalRecord = async (recordData) => {
  try {
    console.log('🤖 Starting AI analysis for:', recordData.title);
    console.log('📋 Category:', recordData.category);
    
    const documentContext = {
      category: recordData.category || 'Medical Document',
      title: recordData.title || 'Untitled',
      description: recordData.description || '',
      doctorName: recordData.doctorName || '',
      hospitalName: recordData.hospitalName || '',
      fileUrl: recordData.fileUrl
    };

    // Try AI analysis
    const result = await analyzeMedicalDocument(documentContext);
    
    console.log('✅ AI Analysis completed:', result.success ? 'Success' : 'Using Fallback');
    
    return result;
    
  } catch (error) {
    console.error('❌ Error in analyzeMedicalRecord:', error);
    
    // Return intelligent fallback
    return {
      success: false,
      error: error.message,
      summary: createFallbackSummary({
        category: recordData.category || 'Medical Document',
        title: recordData.title || 'Untitled',
        description: recordData.description || '',
        doctorName: recordData.doctorName || '',
        hospitalName: recordData.hospitalName || ''
      })
    };
  }
};

module.exports = {
  analyzeMedicalRecord,
  analyzeMedicalDocument
};