/* ============================================
   MedTasks - Clinic Appointment System
   JavaScript - Application Logic & Interactivity
   ============================================ */

// ============== DATA - Mock Doctor Database ==============

/**
 * Sample doctor data array
 * Each doctor object contains:
 * - id: Unique identifier
 * - name: Doctor's full name
 * - specialty: Medical specialty/department
 * - experience: Years of experience
 * - phone: Contact number
 * - avatar: Icon representation
 */
const doctorsData = [
    {
        id: 1,
        name: "Dr. Sarah Johnson",
        specialty: "General Practice",
        experience: "8 years",
        phone: "+1-800-555-0101",
        avatar: "👨‍⚕️",
        photo: "assets/Confident Young Doctor.png",
        available: true,
        times: "9:00 AM - 5:00 PM"
    },
    {
        id: 2,
        name: "Dr. Michael Chen",
        specialty: "Cardiology",
        experience: "12 years",
        phone: "+1-800-555-0102",
        avatar: "👨‍⚕️",
        photo: "assets/Healthcare Professional Portrait (1).png",
        available: false,
        times: "10:00 AM - 6:00 PM"
    },
    {
        id: 3,
        name: "Dr. Emily Watson",
        specialty: "Dermatology",
        experience: "6 years",
        phone: "+1-800-555-0103",
        avatar: "👩‍⚕️",
        photo: "assets/Healthcare Professional Portrait.png",
        available: true,
        times: "8:00 AM - 4:00 PM"
    },
    {
        id: 4,
        name: "Dr. James Rodriguez",
        specialty: "Orthopedics",
        experience: "10 years",
        phone: "+1-800-555-0104",
        avatar: "👨‍⚕️",
        photo: "assets/Medical Professional Portrait (1).png",
        available: true,
        times: "9:30 AM - 5:30 PM"
    },
    {
        id: 5,
        name: "Dr. Lisa Anderson",
        specialty: "Pediatrics",
        experience: "9 years",
        phone: "+1-800-555-0105",
        avatar: "👩‍⚕️",
        photo: "assets/Medical Professional Portrait.png",
        available: false,
        times: "9:00 AM - 4:30 PM"
    },
    {
        id: 6,
        name: "Dr. Robert Thompson",
        specialty: "General Practice",
        experience: "15 years",
        phone: "+1-800-555-0106",
        avatar: "👨‍⚕️",
        photo: "assets/Professional Portrait.png",
        available: true,
        times: "8:30 AM - 5:00 PM"
    },
    {
        id: 7,
        name: "Dr. Patricia Martinez",
        specialty: "Cardiology",
        experience: "11 years",
        phone: "+1-800-555-0107",
        avatar: "👩‍⚕️",
        available: false,
        times: "10:00 AM - 6:00 PM"
    },
    {
        id: 8,
        name: "Dr. William Lee",
        specialty: "Orthopedics",
        experience: "7 years",
        phone: "+1-800-555-0108",
        avatar: "👨‍⚕️",
        available: true,
        times: "9:00 AM - 5:00 PM"
    }
];

// ============== STATE MANAGEMENT ==============

/**
 * Global state object to track application data
 * - selectedDoctor: Currently selected doctor object
 * - appointmentData: Form data for the appointment
 * - filteredDoctors: Doctors list after filtering
 */
const appState = {
    selectedDoctor: null,
    appointmentData: {},
    filteredDoctors: [...doctorsData]
};

// ============== DOM ELEMENTS CACHE ==============

/**
 * Cache frequently used DOM elements for better performance
 * This prevents repeated querySelector calls
 */
const domElements = {
    form: document.getElementById('appointmentForm'),
    doctorsContainer: document.getElementById('doctorsContainer'),
    specialtyFilter: document.getElementById('specialtyFilter'),
    successMessage: document.getElementById('successMessage'),
    selectedDoctorSection: document.getElementById('selectedDoctorSection'),
    selectedDoctorPreview: document.getElementById('selectedDoctorPreview'),
    
    // Form fields
    patientName: document.getElementById('patientName'),
    patientEmail: document.getElementById('patientEmail'),
    patientPhone: document.getElementById('patientPhone'),
    appointmentDate: document.getElementById('appointmentDate'),
    appointmentTime: document.getElementById('appointmentTime'),
    reason: document.getElementById('reason'),
    contactMethod: document.getElementById('contactMethod'),
    carrierGroup: document.getElementById('carrierGroup'),
    carrier: document.getElementById('carrier'),
    
    // Error messages
    nameError: document.getElementById('nameError'),
    emailError: document.getElementById('emailError'),
    phoneError: document.getElementById('phoneError'),
    dateError: document.getElementById('dateError'),
    timeError: document.getElementById('timeError'),
    reasonError: document.getElementById('reasonError')
};

/* ===================== Email/SMS CONFIGURATION =====================
 * This app uses EmailJS (https://www.emailjs.com/) to send emails from the
 * client. EmailJS provides a free tier that works for demo/learning.
 *
 * You'll need to create an EmailJS account, create a service and template,
 * then copy the values below into the placeholders or set them as
 * environment variables when deploying.
 *
 * Placeholders to replace:
 * - EMAILJS_PUBLIC_KEY
 * - EMAILJS_SERVICE_ID
 * - EMAILJS_TEMPLATE_ID
 */
const EMAILJS_PUBLIC_KEY = 'f1PmXiJEMcTYTuZz-';
const EMAILJS_SERVICE_ID = 'service_fbqos3e';
const EMAILJS_TEMPLATE_ID = 'template_dxzbeee';

// Map common carriers to email-to-SMS gateways (US carriers). If you need
// other carriers/countries, add appropriate gateways.
const carrierGateways = {
    att: 'txt.att.net',
    verizon: 'vtext.com',
    tmobile: 'tmomail.net',
    sprint: 'messaging.sprintpcs.com',
    virgin: 'vmobl.com',
    metropcs: 'mymetropcs.com'
};

// Initialize EmailJS if available
if (window.emailjs && EMAILJS_PUBLIC_KEY && EMAILJS_PUBLIC_KEY !== 'YOUR_EMAILJS_PUBLIC_KEY') {
    try { emailjs.init(EMAILJS_PUBLIC_KEY); } catch (e) { console.warn('EmailJS init failed', e); }
}

// ============== UTILITY FUNCTIONS ==============

/**
 * Validates email format using regex pattern
 * @param {string} email - Email address to validate
 * @returns {boolean} - True if email is valid, false otherwise
 */
function validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

/**
 * Validates phone number format (basic validation)
 * Accepts 10-15 digits with optional formatting
 * @param {string} phone - Phone number to validate
 * @returns {boolean} - True if phone is valid, false otherwise
 */
function validatePhone(phone) {
    const phoneRegex = /^[\d\s\-\+\(\)]{10,}$/;
    return phoneRegex.test(phone);
}

/**
 * Clears all error messages from the form
 * Removes the 'show' class from all error message elements
 */
function clearAllErrors() {
    Object.values(domElements).forEach(element => {
        if (element && element.classList && element.classList.contains('error-message')) {
            element.classList.remove('show');
        }
    });
}

/**
 * Sets minimum date for the date input to today
 * Prevents users from booking appointments in the past
 */
function setMinimumDate() {
    const today = new Date().toISOString().split('T')[0];
    domElements.appointmentDate.setAttribute('min', today);
}

// ============== FORM VALIDATION ==============

/**
 * Validates entire appointment form
 * Checks all required fields and displays appropriate error messages
 * @returns {boolean} - True if form is valid, false otherwise
 */
function validateForm() {
    clearAllErrors();
    let isValid = true;

    // Validate patient name
    if (!domElements.patientName.value.trim()) {
        domElements.nameError.textContent = 'Please enter your full name';
        domElements.nameError.classList.add('show');
        isValid = false;
    }

    // Validate email
    const email = domElements.patientEmail.value.trim();
    if (!email) {
        domElements.emailError.textContent = 'Please enter your email';
        domElements.emailError.classList.add('show');
        isValid = false;
    } else if (!validateEmail(email)) {
        domElements.emailError.textContent = 'Please enter a valid email';
        domElements.emailError.classList.add('show');
        isValid = false;
    }

    // Validate phone
    const phone = domElements.patientPhone.value.trim();
    if (!phone) {
        domElements.phoneError.textContent = 'Please enter your phone number';
        domElements.phoneError.classList.add('show');
        isValid = false;
    } else if (!validatePhone(phone)) {
        domElements.phoneError.textContent = 'Please enter a valid phone number';
        domElements.phoneError.classList.add('show');
        isValid = false;
    }

    // Validate date
    if (!domElements.appointmentDate.value) {
        domElements.dateError.textContent = 'Please select an appointment date';
        domElements.dateError.classList.add('show');
        isValid = false;
    }

    // Validate time
    if (!domElements.appointmentTime.value) {
        domElements.timeError.textContent = 'Please select an appointment time';
        domElements.timeError.classList.add('show');
        isValid = false;
    }

    // Validate reason for visit
    if (!domElements.reason.value.trim()) {
        domElements.reasonError.textContent = 'Please describe your reason for visit';
        domElements.reasonError.classList.add('show');
        isValid = false;
    }

    return isValid;
}

// ============== FORM SUBMISSION ==============

/**
 * Handles form submission event
 * Validates form, collects data, and displays success message
 * In a real application, this would send data to a server
 * @param {Event} event - Form submission event
 */
function handleFormSubmit(event) {
    event.preventDefault(); // Prevent default form submission

    // Validate form before processing
    if (!validateForm()) {
        console.log('Form validation failed');
        return;
    }

    // Collect all form data
    const appointmentData = {
        patientName: domElements.patientName.value.trim(),
        patientEmail: domElements.patientEmail.value.trim(),
        patientPhone: domElements.patientPhone.value.trim(),
        appointmentDate: domElements.appointmentDate.value,
        appointmentTime: domElements.appointmentTime.value,
        reason: domElements.reason.value.trim(),
        selectedDoctor: appState.selectedDoctor
    };

    // Store appointment data in state
    appState.appointmentData = appointmentData;

    // Log appointment data (in real app, send to server)
    console.log('Appointment booked:', appointmentData);

    // Send notifications (email and/or SMS) using EmailJS
    sendNotifications(appointmentData).finally(() => {
        // Display success message after attempting notifications
        showSuccessMessage();

        // Reset form fields
        domElements.form.reset();

        // Redirect to payout page after 1.5 seconds
        setTimeout(() => {
            window.location.href = 'payout.html';
        }, 1500);
    });
}

/**
 * Send notifications using EmailJS. If contactMethod includes SMS, the SMS
 * is sent via carrier email-to-SMS gateway (constructed from phone and carrier).
 * This function uses EmailJS client to send email; you must configure service
 * and template in your EmailJS account and replace placeholders above.
 *
 * @param {Object} appointmentData
 * @returns {Promise}
 */
function sendNotifications(appointmentData) {
    // If EmailJS not configured, skip sending and resolve
    if (!window.emailjs || EMAILJS_PUBLIC_KEY === 'YOUR_EMAILJS_PUBLIC_KEY') {
        console.warn('EmailJS not configured. Install keys per README to enable email/SMS.');
        return Promise.resolve();
    }

    const promises = [];

    const contactMethod = (domElements.contactMethod && domElements.contactMethod.value) || 'email';

    // Template params common to email template
    const templateParams = {
        patient_name: appointmentData.patientName,
        patient_email: appointmentData.patientEmail,
        patient_phone: appointmentData.patientPhone,
        appointment_date: appointmentData.appointmentDate,
        appointment_time: appointmentData.appointmentTime,
        reason: appointmentData.reason,
        doctor_name: appointmentData.selectedDoctor ? appointmentData.selectedDoctor.name : 'TBD',
        doctor_times: appointmentData.selectedDoctor ? appointmentData.selectedDoctor.times : ''
    };

    // Send email to patient (if email selected)
    if (contactMethod === 'email' || contactMethod === 'both') {
        const emailParams = Object.assign({}, templateParams, {
            to_email: appointmentData.patientEmail
        });
        promises.push(emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, emailParams));
    }

    // Send SMS via carrier gateway by emailing the carrier address
    if (contactMethod === 'sms' || contactMethod === 'both') {
        const carrierKey = domElements.carrier ? domElements.carrier.value : '';
        const gateway = carrierGateways[carrierKey];
        if (gateway && appointmentData.patientPhone) {
            // Normalize phone digits only
            const digits = (appointmentData.patientPhone || '').replace(/\D/g, '');
            const smsEmail = `${digits}@${gateway}`;

            const smsParams = Object.assign({}, templateParams, {
                to_email: smsEmail
            });

            promises.push(emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, smsParams));
        } else {
            console.warn('SMS not sent: carrier or phone missing/unsupported.');
        }
    }

    // Return Promise that resolves when all sends complete (some may fail)
    return Promise.allSettled(promises).then(results => {
        results.forEach(r => {
            if (r.status === 'fulfilled') console.log('Notification sent:', r.value);
            else console.warn('Notification failed:', r.reason);
        });
    });
}

/**
 * Displays success message and hides after delay
 */
function showSuccessMessage() {
    domElements.successMessage.classList.remove('hidden');
    
    // Hide success message after 4 seconds
    setTimeout(() => {
        domElements.successMessage.classList.add('hidden');
    }, 4000);
}

// ============== DOCTOR RENDERING ==============

/**
 * Renders doctor cards in the doctors container
 * Creates interactive cards for each doctor in the filtered list
 */
function renderDoctors() {
    // Clear existing doctor cards
    domElements.doctorsContainer.innerHTML = '';

    // If no doctors match filter, show message
    if (appState.filteredDoctors.length === 0) {
        domElements.doctorsContainer.innerHTML = '<p style="text-align: center; color: #999;">No doctors found for this specialty.</p>';
        return;
    }

    // Create and append doctor card for each doctor
    appState.filteredDoctors.forEach(doctor => {
        const doctorCard = createDoctorCard(doctor);
        domElements.doctorsContainer.appendChild(doctorCard);
    });
}

/**
 * Creates a single doctor card element
 * @param {Object} doctor - Doctor object from doctorsData
 * @returns {HTMLElement} - Complete doctor card DOM element
 */
function createDoctorCard(doctor) {
    // Create main card container
    const card = document.createElement('div');
    card.className = 'doctor-card';
    card.dataset.doctorId = doctor.id;

    // Add selected class if this doctor is currently selected
    if (appState.selectedDoctor && appState.selectedDoctor.id === doctor.id) {
        card.classList.add('selected');
    }

    // Build avatar HTML: prefer photo if available, otherwise emoji avatar
    const avatarHTML = doctor.photo
        ? `<img src="${doctor.photo}" alt="${doctor.name}" class="doctor-avatar-img" loading="lazy">`
        : `<div class="doctor-avatar">${doctor.avatar}</div>`;

    // Add unavailable class and label when doctor is not available
    if (!doctor.available) {
        card.classList.add('unavailable');
    }

    const availabilityLabel = doctor.available
        ? `<div class="doctor-availability">Available</div>`
        : `<div class="doctor-availability unavailable">Unavailable</div>`;

    // Build card HTML content
    card.innerHTML = `
        ${avatarHTML}
        <div class="doctor-info">
            <div class="doctor-name">${doctor.name}</div>
            <div class="doctor-specialty">${doctor.specialty}</div>
            <div class="doctor-experience">Experience: ${doctor.experience}</div>
            <span class="doctor-times">📅 ${doctor.times}</span>
            ${availabilityLabel}
        </div>
    `;

    // Add click event listener
    card.addEventListener('click', () => selectDoctor(doctor));

    return card;
}

/**
 * Handles doctor selection
 * Updates selected doctor state and displays doctor preview
 * @param {Object} doctor - Doctor object that was selected
 */
function selectDoctor(doctor) {
    // Update selected doctor in state
    // If doctor is unavailable, show an alert and do not select
    if (!doctor.available) {
        alert(`${doctor.name} is currently unavailable. Please select another doctor or choose a different time.`);
        return;
    }

    appState.selectedDoctor = doctor;

    // Re-render doctors to update visual selection
    renderDoctors();

    // Show and populate selected doctor section
    displaySelectedDoctor(doctor);
}

/**
 * Displays selected doctor in the preview section
 * @param {Object} doctor - Selected doctor object
 */
function displaySelectedDoctor(doctor) {
    // Show the selected doctor section
    domElements.selectedDoctorSection.classList.remove('hidden');

    // Create preview HTML (use image when available)
    const previewAvatar = doctor.photo
        ? `<img src="${doctor.photo}" alt="${doctor.name}" class="doctor-avatar-img preview-avatar">`
        : `<div class="doctor-avatar">${doctor.avatar}</div>`;

    const previewHTML = `
        ${previewAvatar}
        <div class="doctor-preview-details">
            <h4>${doctor.name}</h4>
            <p><strong>Specialty:</strong> ${doctor.specialty}</p>
            <p><strong>Experience:</strong> ${doctor.experience}</p>
            <p><strong>Available Times:</strong> ${doctor.times}</p>
            <p><strong>Phone:</strong> <a href="tel:${doctor.phone}">${doctor.phone}</a></p>
            <p style="margin-top: 1rem; color: #0070F3;"><strong>✓ Ready to accept your appointment</strong></p>
        </div>
    `;

    // Insert preview HTML
    domElements.selectedDoctorPreview.innerHTML = previewHTML;
}

/**
 * Clears the selected doctor and hides the preview section
 */
function clearSelectedDoctor() {
    appState.selectedDoctor = null;
    domElements.selectedDoctorSection.classList.add('hidden');
    renderDoctors();
}

// ============== FILTERING ==============

/**
 * Filters doctors based on selected specialty
 * Updates the filtered list in state and re-renders cards
 */
function filterDoctorsBySpecialty() {
    const selectedSpecialty = domElements.specialtyFilter.value;

    // Filter doctors if specialty is selected, otherwise show all
    if (selectedSpecialty) {
        appState.filteredDoctors = doctorsData.filter(
            doctor => doctor.specialty === selectedSpecialty
        );
    } else {
        appState.filteredDoctors = [...doctorsData];
    }

    // Clear selected doctor when filtering
    clearSelectedDoctor();

    // Re-render doctor cards
    renderDoctors();
}

// ============== EVENT LISTENERS ==============

/**
 * Initialize all event listeners
 * Runs after DOM is loaded
 */
function initializeEventListeners() {
    // Form submission
    domElements.form.addEventListener('submit', handleFormSubmit);

    // Doctor specialty filter
    domElements.specialtyFilter.addEventListener('change', filterDoctorsBySpecialty);

    // Set minimum date for appointment
    setMinimumDate();

    // Contact method change -> toggle carrier selector
    if (domElements.contactMethod) {
        domElements.contactMethod.addEventListener('change', (e) => {
            if (e.target.value === 'sms' || e.target.value === 'both') {
                domElements.carrierGroup.style.display = 'block';
            } else {
                domElements.carrierGroup.style.display = 'none';
            }
        });
    }
}

// ============== INITIALIZATION ==============

/**
 * Main initialization function
 * Runs when DOM is fully loaded
 * Sets up the application
 */
function initializeApp() {
    console.log('MedTasks Application Initialized');

    // Render initial doctor list
    renderDoctors();

    // Initialize all event listeners
    initializeEventListeners();
}

// Start the application when DOM is ready
document.addEventListener('DOMContentLoaded', initializeApp);

// Optional: Export functions for testing purposes
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        validateEmail,
        validatePhone,
        validateForm
    };
}
