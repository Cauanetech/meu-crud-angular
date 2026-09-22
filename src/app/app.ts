import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MovieService } from './movie';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="container">
      <h1>🎬 Gestão de Filmes</h1>

      <!-- Formulário -->
      <div class="card-form">
        <input type="text" placeholder="Título do filme" [(ngModel)]="currentMovie.title" />
        <input type="text" placeholder="Género" [(ngModel)]="currentMovie.Genre" />
        
        <button class="btn-save" (click)="saveMovie()">
          {{ isEditing ? 'Atualizar' : 'Guardar' }}
        </button>
        
        <button class="btn-cancel" *ngIf="isEditing" (click)="cancelEdit()">
          Cancelar
        </button>
      </div>

      <!-- Lista -->
      <h3>Lista de Filmes</h3>
      <ul class="movie-list">
        <li class="movie-item" *ngFor="let movie of movies">
          <span><strong>{{ movie.title }}</strong> <small>({{ movie.Genre }})</small></span>
          <div>
            <button class="btn-edit" (click)="editMovie(movie)">Editar</button>
            <button class="btn-delete" (click)="deleteMovie(movie.id)">Apagar</button>
          </div>
        </li>
      </ul>
    </div>
  `,
  styles: [`
    body, html {
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
      background-color: #f7f5f8;
      color: #4a4e69;
      margin: 0;
      padding: 0;
    }

    .container {
      max-width: 650px;
      margin: 40px auto;
      background: #ffffff;
      padding: 30px;
      border-radius: 16px;
      box-shadow: 0 10px 30px rgba(154, 140, 152, 0.1);
    }

    h1 {
      color: #3d3a45;
      margin-bottom: 25px;
      font-size: 26px;
      font-weight: 600;
    }

    h3 {
      color: #8c7b8d;
      font-size: 15px;
      margin-top: 0;
      letter-spacing: 0.5px;
    }

    .card-form {
      background: #fcf6f5;
      padding: 20px;
      border-radius: 12px;
      margin-bottom: 25px;
      display: flex;
      gap: 12px;
      flex-wrap: wrap;
      align-items: center;
      border: 1px solid #f2e9e4;
    }

    .card-form input {
      flex: 1;
      min-width: 150px;
      padding: 12px 14px;
      border: 1px solid #e3d5ca;
      border-radius: 8px;
      font-size: 14px;
      outline: none;
      background: #ffffff;
      color: #4a4e69;
      transition: all 0.2s;
    }

    .card-form input:focus {
      border-color: #b5838d;
      box-shadow: 0 0 0 3px rgba(181, 131, 141, 0.15);
    }

    button {
      padding: 11px 18px;
      border: none;
      border-radius: 8px;
      font-weight: 600;
      cursor: pointer;
      font-size: 14px;
      transition: transform 0.1s, opacity 0.2s;
    }

    button:hover {
      opacity: 0.9;
      transform: translateY(-1px);
    }

    .btn-save {
      background-color: #a3c4bc;
      color: #2f3e46;
    }

    .btn-cancel {
      background-color: #d8e2dc;
      color: #4a5759;
    }

    .movie-list {
      list-style: none;
      padding: 0;
      margin: 0;
    }

    .movie-item {
      background: #ffffff;
      border: 1px solid #f0ead2;
      padding: 14px 18px;
      border-radius: 10px;
      margin-bottom: 12px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      box-shadow: 0 2px 6px rgba(0, 0, 0, 0.02);
      transition: all 0.2s;
    }

    .movie-item:hover {
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
      border-color: #e3d5ca;
    }

    .movie-item small {
      color: #9a8c98;
      font-weight: normal;
    }

    .btn-edit {
      background-color: #f4a261;
      color: #ffffff;
      padding: 7px 14px;
      margin-right: 6px;
    }

    .btn-delete {
      background-color: #e5989b;
      color: #ffffff;
      padding: 7px 14px;
    }
  `]
})
export class App implements OnInit {
  movies: any[] = [];
  currentMovie: any = { title: '', Genre: '' };
  isEditing: boolean = false;

  constructor(private movieService: MovieService) {}

  ngOnInit() {
    this.loadMovies();
  }

  loadMovies() {
    this.movieService.getMovies().subscribe((data) => {
      this.movies = data;
    });
  }

  saveMovie() {
    if (!this.currentMovie.title || !this.currentMovie.Genre) return;

    if (this.isEditing) {
      this.movieService.updateMovie(this.currentMovie.id, this.currentMovie).subscribe(() => {
        this.loadMovies();
        this.cancelEdit();
      });
    } else {
      this.movieService.addMovie(this.currentMovie).subscribe(() => {
        this.loadMovies();
        this.currentMovie = { title: '', Genre: '' };
      });
    }
  }

  editMovie(movie: any) {
    this.currentMovie = { ...movie };
    this.isEditing = true;
  }

  cancelEdit() {
    this.currentMovie = { title: '', Genre: '' };
    this.isEditing = false;
  }

  deleteMovie(id: number) {
    this.movieService.deleteMovie(id).subscribe(() => {
      this.loadMovies();
    });
  }
}