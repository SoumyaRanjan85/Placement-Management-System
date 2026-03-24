import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Subject, takeUntil } from 'rxjs';

// Services
import { StudentService } from '../../services/student.service';

// Models
import { Student, Education, Project } from '../../models/student.model';

@Component({
  selector: 'app-student-profile',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './student-profile.component.html',
  styleUrls: ['./student-profile.component.css']
})
export class StudentProfileComponent implements OnInit, OnDestroy {
  // Component state
  student: Student | null = null;
  profileForm: FormGroup;
  educationForm: FormGroup;
  projectForm: FormGroup;
  
  // UI state
  activeTab: 'personal' | 'academic' | 'education' | 'projects' | 'skills' = 'personal';
  isEditing = false;
  isLoading = false;
  hasError = false;
  errorMessage = '';

  // Configuration
  suggestedSkills = ['JavaScript', 'TypeScript', 'Angular', 'React', 'Node.js', 'Python', 'Java', 'SQL', 'MongoDB', 'AWS'];
  
  // For cleanup
  private destroy$ = new Subject<void>();

  constructor(
    private studentService: StudentService,
    private fb: FormBuilder
  ) {
    this.profileForm = this.createProfileForm();
    this.educationForm = this.createEducationForm();
    this.projectForm = this.createProjectForm();
  }

  ngOnInit(): void {
    this.loadStudentProfile();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  /**
   * Loads student profile data
   */
  loadStudentProfile(): void {
    this.isLoading = true;
    this.hasError = false;

    // For demo purposes, create a mock student
    setTimeout(() => {
      this.student = this.createMockStudent();
      this.populateProfileForm();
      this.isLoading = false;
      
      // Uncomment for real API call:
      /*
      const studentId = '123'; // TODO: Get from authentication service
      
      this.studentService.getStudentProfile(studentId)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: (student) => {
            this.student = student;
            this.populateProfileForm();
            this.isLoading = false;
          },
          error: (error) => {
            console.error('Error loading profile:', error);
            this.hasError = true;
            this.errorMessage = 'Failed to load profile. Please try again.';
            this.isLoading = false;
          }
        });
      */
    }, 500); // Simulate API delay
  }

  /**
   * Creates profile form with validations
   */
  private createProfileForm(): FormGroup {
    return this.fb.group({
      personalInfo: this.fb.group({
        firstName: ['', [Validators.required, Validators.maxLength(50)]],
        lastName: ['', [Validators.required, Validators.maxLength(50)]],
        email: ['', [Validators.required, Validators.email, Validators.maxLength(100)]],
        phone: ['', [Validators.required, Validators.pattern(/^\+?[0-9\s\-\(\)]{10,}$/)]],
        address: ['', [Validators.required, Validators.maxLength(200)]],
        dateOfBirth: ['', Validators.required]
      }),
      academicInfo: this.fb.group({
        college: ['', [Validators.required, Validators.maxLength(100)]],
        degree: ['', [Validators.required, Validators.maxLength(50)]],
        branch: ['', [Validators.required, Validators.maxLength(50)]],
        semester: ['', [Validators.required, Validators.min(1), Validators.max(12)]],
        cgpa: ['', [Validators.required, Validators.min(0), Validators.max(10)]],
        graduationYear: ['', [Validators.required, Validators.min(2000), Validators.max(2030)]]
      }),
      skills: this.fb.control([], [Validators.maxLength(20)])
    });
  }

  /**
   * Creates education form with validations
   */
  private createEducationForm(): FormGroup {
    return this.fb.group({
      institution: ['', [Validators.required, Validators.maxLength(100)]],
      degree: ['', [Validators.required, Validators.maxLength(50)]],
      fieldOfStudy: ['', [Validators.required, Validators.maxLength(50)]],
      startDate: ['', Validators.required],
      endDate: ['', Validators.required],
      percentage: ['', [Validators.required, Validators.min(0), Validators.max(100)]],
      isCurrentlyStudying: [false]
    });
  }

  /**
   * Creates project form with validations
   */
  private createProjectForm(): FormGroup {
    return this.fb.group({
      title: ['', [Validators.required, Validators.maxLength(100)]],
      description: ['', [Validators.required, Validators.maxLength(500)]],
      technologies: this.fb.control([], [Validators.maxLength(15)]),
      duration: ['', Validators.maxLength(50)],
      githubLink: ['', Validators.pattern(/^(https?:\/\/)?(www\.)?github\.com\/[a-zA-Z0-9-]+\/[a-zA-Z0-9-]+$/)],
      liveDemoLink: ['', Validators.pattern(/^(https?:\/\/)?(www\.)?[a-zA-Z0-9-]+\.[a-zA-Z]{2,}(\/[a-zA-Z0-9-]*)*$/)]
    });
  }

  /**
   * Populates forms with student data
   */
  private populateProfileForm(): void {
    if (!this.student) return;

    this.profileForm.patchValue({
      personalInfo: {
        ...this.student.personalInfo,
        dateOfBirth: this.formatDateForInput(this.student.personalInfo.dateOfBirth)
      },
      academicInfo: this.student.academicInfo,
      skills: this.student.skills || []
    });
  }

  /**
   * Creates mock student data for demonstration
   */
  private createMockStudent(): Student {
    return {
      id: '123',
      userId: 'user123',
      personalInfo: {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@example.com',
        phone: '+1234567890',
        address: '123 Main St, City, State',
        dateOfBirth: new Date('2000-01-01')
      },
      academicInfo: {
        college: 'ABC University',
        degree: 'B.Tech',
        branch: 'Computer Science',
        semester: 6,
        cgpa: 8.5,
        graduationYear: 2024
      },
      skills: ['JavaScript', 'Angular', 'TypeScript'],
      education: [
        {
          institution: 'ABC University',
          degree: 'B.Tech',
          field: 'Computer Science',
          startDate: new Date('2020-08-01'),
          endDate: new Date('2024-05-01'),
          percentage: 85
        }
      ],
      projects: [
        {
          title: 'Student Management System',
          description: 'A comprehensive system for managing student data',
          technologies: ['Angular', 'Node.js', 'MongoDB'],
          duration: '3 months',
          githubLink: 'https://github.com/johndoe/student-management'
        }
      ],
      resumeUrl: '',
      profilePhoto: '',
      createdAt: new Date(),
      updatedAt: new Date()
    };
  }

  /**
   * Saves profile data
   */
  onSaveProfile(): void {
    if (this.profileForm.invalid || !this.student) {
      this.markFormGroupTouched(this.profileForm);
      return;
    }

    this.isLoading = true;
    
    // For demo purposes, update local student object
    setTimeout(() => {
      const formValue = this.profileForm.value;
      
      if (this.student) {
        Object.assign(this.student.personalInfo, {
          ...formValue.personalInfo,
          dateOfBirth: new Date(formValue.personalInfo.dateOfBirth)
        });
        
        Object.assign(this.student.academicInfo, formValue.academicInfo);
        this.student.skills = formValue.skills;
      }
      
      this.isEditing = false;
      this.isLoading = false;
      
      // Show success message (implement toast/notification service)
      console.log('Profile updated successfully');
      
      // Uncomment for real API call:
      /*
      this.studentService.updateStudentProfile(this.student.id, this.profileForm.value)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: (updatedStudent) => {
            this.student = updatedStudent;
            this.isEditing = false;
            this.isLoading = false;
            // Show success message
          },
          error: (error) => {
            console.error('Error updating profile:', error);
            this.isLoading = false;
            this.hasError = true;
            this.errorMessage = 'Failed to update profile. Please try again.';
          }
        });
      */
    }, 1000);
  }

  /**
   * Adds education entry
   */
  onAddEducation(): void {
    if (this.educationForm.invalid || !this.student) {
      this.markFormGroupTouched(this.educationForm);
      return;
    }

    const educationData = {
      ...this.educationForm.value,
      field: this.educationForm.value.fieldOfStudy,
      startDate: new Date(this.educationForm.value.startDate),
      endDate: this.educationForm.value.isCurrentlyStudying ? null : new Date(this.educationForm.value.endDate)
    };

    // For demo purposes, add to local student object
    if (!this.student.education) {
      this.student.education = [];
    }
    
    this.student.education.push(educationData);
    this.educationForm.reset({ isCurrentlyStudying: false });
    
    // Uncomment for real API call:
    /*
    this.studentService.addEducation(this.student.id, this.educationForm.value)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (updatedStudent) => {
          this.student = updatedStudent;
          this.educationForm.reset({ isCurrentlyStudying: false });
        },
        error: (error) => {
          console.error('Error adding education:', error);
        }
      });
    */
  }

  /**
   * Adds project entry
   */
  onAddProject(): void {
    if (this.projectForm.invalid || !this.student) {
      this.markFormGroupTouched(this.projectForm);
      return;
    }

    // For demo purposes, add to local student object
    if (!this.student.projects) {
      this.student.projects = [];
    }
    
    this.student.projects.push(this.projectForm.value);
    this.projectForm.reset();
    
    // Uncomment for real API call:
    /*
    this.studentService.addProject(this.student.id, this.projectForm.value)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (updatedStudent) => {
          this.student = updatedStudent;
          this.projectForm.reset();
        },
        error: (error) => {
          console.error('Error adding project:', error);
        }
      });
    */
  }

  // Skill Management Methods
  addSkillInput(event: Event): void {
    event.preventDefault();
    const input = event.target as HTMLInputElement;
    const value = input.value.trim();
    
    if (value && this.validateSkill(value)) {
      const skills = this.profileForm.get('skills')?.value || [];
      if (!skills.includes(value)) {
        skills.push(value);
        this.profileForm.get('skills')?.setValue(skills);
        this.profileForm.get('skills')?.updateValueAndValidity();
      }
      input.value = '';
    }
  }

  addTechnology(event: Event): void {
    event.preventDefault();
    const input = event.target as HTMLInputElement;
    const value = input.value.trim();
    
    if (value && this.validateTechnology(value)) {
      const technologies = this.projectForm.get('technologies')?.value || [];
      if (!technologies.includes(value)) {
        technologies.push(value);
        this.projectForm.get('technologies')?.setValue(technologies);
        this.projectForm.get('technologies')?.updateValueAndValidity();
      }
      input.value = '';
    }
  }

  addSuggestedSkill(skill: string): void {
    const skills = this.profileForm.get('skills')?.value || [];
    if (!skills.includes(skill)) {
      skills.push(skill);
      this.profileForm.get('skills')?.setValue(skills);
      this.profileForm.get('skills')?.updateValueAndValidity();
    }
  }

  onSkillRemove(skill: string): void {
    const skills = this.profileForm.get('skills')?.value || [];
    const index = skills.indexOf(skill);
    if (index >= 0) {
      skills.splice(index, 1);
      this.profileForm.get('skills')?.setValue(skills);
      this.profileForm.get('skills')?.updateValueAndValidity();
    }
  }

  onTechnologyRemove(tech: string): void {
    const technologies = this.projectForm.get('technologies')?.value || [];
    const index = technologies.indexOf(tech);
    if (index >= 0) {
      technologies.splice(index, 1);
      this.projectForm.get('technologies')?.setValue(technologies);
      this.projectForm.get('technologies')?.updateValueAndValidity();
    }
  }

  // Helper Methods
  private validateSkill(skill: string): boolean {
    return skill.length >= 2 && skill.length <= 30 && /^[a-zA-Z0-9\s.#+]+$/.test(skill);
  }

  private validateTechnology(tech: string): boolean {
    return tech.length >= 2 && tech.length <= 30 && /^[a-zA-Z0-9\s.#+]+$/.test(tech);
  }

  private formatDateForInput(date: Date | string): string {
    const d = new Date(date);
    return d.toISOString().split('T')[0];
  }

  private markFormGroupTouched(formGroup: FormGroup): void {
    Object.values(formGroup.controls).forEach(control => {
      control.markAsTouched();
      if (control instanceof FormGroup) {
        this.markFormGroupTouched(control);
      }
    });
  }

  // UI State Methods
  setActiveTab(tab: 'personal' | 'academic' | 'education' | 'projects' | 'skills'): void {
    this.activeTab = tab;
  }

  toggleEditMode(): void {
    this.isEditing = !this.isEditing;
    if (!this.isEditing) {
      this.populateProfileForm(); // Reset form to original values
    }
  }

  cancelEdit(): void {
    this.isEditing = false;
    this.populateProfileForm();
  }

  // Getters for template convenience
  get personalInfoForm(): FormGroup {
    return this.profileForm.get('personalInfo') as FormGroup;
  }

  get academicInfoForm(): FormGroup {
    return this.profileForm.get('academicInfo') as FormGroup;
  }

  get skillsArray(): string[] {
    return this.profileForm.get('skills')?.value || [];
  }

  get technologiesArray(): string[] {
    return this.projectForm.get('technologies')?.value || [];
  }

  // Calculated properties
  get profileCompletionPercentage(): number {
    if (!this.student) return 0;
    
    let completion = 0;
    const personalInfo = this.student.personalInfo;
    const academicInfo = this.student.academicInfo;
    
    if (personalInfo?.firstName && personalInfo?.lastName) completion += 20;
    if (personalInfo?.email) completion += 10;
    if (personalInfo?.phone) completion += 10;
    if (academicInfo?.college && academicInfo?.degree) completion += 20;
    if (this.student.skills?.length > 0) completion += 20;
    if (this.student.resumeUrl) completion += 20;
    
    return completion;
  }

  // Form validation helpers
  hasErrorInField(formGroup: FormGroup, fieldName: string, errorType: string): boolean {
    const field = formGroup.get(fieldName);
    return field ? field.hasError(errorType) && field.touched : false;
  }

  getFieldErrorMessage(formGroup: FormGroup, fieldName: string): string {
    const field = formGroup.get(fieldName);
    if (!field || !field.errors || !field.touched) return '';
    
    const errors = field.errors;
    
    if (errors['required']) return 'This field is required';
    if (errors['email']) return 'Please enter a valid email';
    if (errors['pattern']) return 'Invalid format';
    if (errors['min']) return `Minimum value is ${errors['min'].min}`;
    if (errors['max']) return `Maximum value is ${errors['max'].max}`;
    if (errors['maxlength']) return `Maximum length is ${errors['maxlength'].requiredLength} characters`;
    
    return 'Invalid value';
  }
}