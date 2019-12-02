import {Component, OnInit} from '@angular/core';
import { CoursesService } from '../services/courses.service';
import { Observable } from 'rxjs';
import { Course } from '../model/course';
import { map, filter } from 'rxjs/operators';




@Component({
    selector: 'home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  courses$ = new Observable<Course[]>();
  begincourses$: Observable<Course []> = new Observable<Course[]>();
  advancedcourses$ = new Observable<Course[]>();
  


  constructor(private coursesService: CoursesService) {}

  

  ngOnInit() {
   this.reloadCouses();
  }

  reloadCouses(){
    this.courses$ = this.coursesService.fetcAllCourses();

    this.begincourses$ = this.courses$
    .pipe( map( (courses: Course []) =>  courses.filter(course => course.categories.includes('BEGINNER'))));

    this.advancedcourses$ = this.courses$
    .pipe( map( (courses: Course []) =>  courses.filter(course => course.categories.includes('ADVANCED'))));

  }

}
