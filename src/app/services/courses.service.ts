import { Injectable } from '@angular/core';

// * FIRE BASE
import { OrderByDirection } from '@firebase/firestore-types';
import { AngularFirestore } from '@angular/fire/firestore';
import { Course } from '../model/course';
import { map, first } from 'rxjs/operators';
import { convertSnaps } from './db-utils';
import { Observable, from } from 'rxjs';
import { Lesson } from '../model/lesson';


@Injectable({
  providedIn: 'root'
})
export class CoursesService {
    
 
  constructor(public db: AngularFirestore) {
    console.log('Init AngularFirestore');
  }

  // **************************************************** //
  // ***              'Update Course'                *** //
  // **************************************************** //
  saveCourse( courseId: string, changes: Partial<Course>): Observable<any> {
        return from (this.db.doc(`courses/${courseId}`).update(changes));
  }


  // **************************************************** //
  // ***     'Fetch all courses from Firebise'        *** //
  // **************************************************** //

  fetcAllCourses() {
    return this.db
      .collection('courses',
          /* ref => ref.where('categories', 'array-contains', 'BEGINNER')).snapshotChanges() */
         ref => ref.orderBy('seqNo')).snapshotChanges().pipe(
          map(snaps => convertSnaps<Course>(snaps)),
          first());
  }

  // **************************************************** //
  // ***    'Changes from courses colllection'         *** //
  // **************************************************** //

  fetcAllStateChanges() {
    this.db
      .collection('courses').stateChanges()
      .subscribe(snaps => {
        console.log(snaps);
       
      });
  }
  
  findCourseByurl(courseUrl: string): Observable<Course> {
    return this.db.collection('courses', ref =>
    ref.where('url', '==', courseUrl)).
      snapshotChanges().pipe(
        map (snaps => {
          const courses = convertSnaps<Course>(snaps);
          return courses.length === 1 ? courses[0] : undefined;
        }),
        first());
  }

  findLessons(courseId: string, sortOrder: OrderByDirection  = 'asc',
              pageNumber = 0 , pageSize = 3 ): Observable<Lesson[]> {
          
      return this.db.collection(`courses/${courseId}/lessons`, 
                    ref => ref.orderBy('seqNo', sortOrder)
                        .limit(pageSize)
                        .startAfter(pageNumber * pageSize))
              .snapshotChanges()
              .pipe(
                map(snaps => convertSnaps <Lesson>(snaps)),
                first()
              );
    }

    
}
