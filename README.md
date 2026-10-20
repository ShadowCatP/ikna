# Ikna

## Get started

1. Install dependencies

   ```bash
   npm install
   ```

2. Start the app

   ```bash
   npx expo start
   ```

   or

   ```bash
   npm run start
   ```

In the output, you'll find options to open the app in a

- [development build](https://docs.expo.dev/develop/development-builds/introduction/)
- [Android emulator](https://docs.expo.dev/workflow/android-studio-emulator/)
- [iOS simulator](https://docs.expo.dev/workflow/ios-simulator/)
- [Expo Go](https://expo.dev/go), a limited sandbox for trying out app development with Expo

You can start developing by editing the files inside the **app** directory. This project uses [file-based routing](https://docs.expo.dev/router/introduction).

## Available scripts

Run scripts with `npm run <script>`:

| Script          | Description                                                            |
| --------------- | ---------------------------------------------------------------------- |
| `start`         | Start Expo development server.                                         |
| `android`       | Start Expo and open Android target.                                    |
| `ios`           | Start Expo and open iOS target.                                        |
| `web`           | Start Expo and open web target.                                        |
| `typecheck`     | Run TypeScript checks without emitting files.                          |
| `lint`          | Run ESLint through Expo.                                               |
| `format`        | Format supported project files with Prettier.                          |
| `format:check`  | Check formatting without changing files.                               |
| `reset-project` | Move starter code to `app-example` and create a blank `app` directory. |

CI runs `typecheck`, `format:check`, and `lint` on every push and on pull requests targeting `main`.

## Get a fresh project

When you're ready, run:

```bash
npm run reset-project
```

This command will move the starter code to the **app-example** directory and create a blank **app** directory where you can start developing.

### Other setup steps

- To set up ESLint for linting, run `npx expo lint`, or follow our guide on ["Using ESLint and Prettier"](https://docs.expo.dev/guides/using-eslint/)
- If you'd like to set up unit testing, follow our guide on ["Unit Testing with Jest"](https://docs.expo.dev/develop/unit-testing/)
- Learn more about the TypeScript setup in this template in our guide on ["Using TypeScript"](https://docs.expo.dev/guides/typescript/)

## Learn more

To learn more about developing your project with Expo, look at the following resources:

- [Expo documentation](https://docs.expo.dev/): Learn fundamentals, or go into advanced topics with our [guides](https://docs.expo.dev/guides).
- [Learn Expo tutorial](https://docs.expo.dev/tutorial/introduction/): Follow a step-by-step tutorial where you'll create a project that runs on Android, iOS, and the web.

## Join the community

Join our community of developers creating universal apps.

- [Expo on GitHub](https://github.com/expo/expo): View our open source platform and contribute.
- [Discord community](https://chat.expo.dev): Chat with Expo users and ask questions.

## About this project

This project's aim is to create a mobile app for repetition study using flashcards. The main inspiration is app known as Anki. This app enables users to organize custom flashcards in decks, grade their knowledge of that card and optimize long-term learning of selected subject based on algorithmic intervals.

### Tech stack

- React native + Expo: mainly chosen because Expo Go which allows to test the app on real device.
- Styling: NativeWind
- Supabase: auth, deck syncing, maybe deck sharing.

### Functional requirements

1. Users must be able to sign up, log in and log out using email/password
2. unauthenticated users should be restricted to guest mode
3. Users should be able to create, edit and delete flashcards (for example for learning languages, where front of the card will contain word in target language and back will have the definition)
4. Users should be able to create decks and add their flashcards in them
5. Decks should display general info such as flashcard count, cards due today, etc.
6. The app must filter and present a list of due cards for a selected deck base on their scheduled review date
7. During a review session user must be able to tap/swipe a card to reveal its other side
8. After revealing the answer user must select one of four self-evaluation ratings: again, hard, good, easy
9. The app must automatically calculate and update the card's next due date and review interval using a built-in spaced repetition formula
10. Upon finishing all due cards in a deck, the app must display a session summary screen with statistics such as cards reviewed, time spent
11. When online user decks, cards and review intervals should sync bidirectionally with backend

### Non-functional requirements

1. Card flip/reveal animations and general gesture responses must run at 60 FPS
2. The app must function fully without an active internet connection by storing data locally and syncing changes once connectivity is restored
3. The app must be fully compatible and tested across both iOS and Android
4. Supabase Row Level Security policies must be enforced
5. Layouts must adapt cleanly to various mobile screen sizes

---

## O projekcie (This section been translated by AI, you've been warned)

Celem projektu jest stworzenie aplikacji mobilnej do nauki z powtórkami wykorzystującej fiszki. Główną inspiracją jest aplikacja Anki. Aplikacja umożliwia użytkownikom organizowanie własnych fiszek w talie, ocenianie znajomości poszczególnych kart oraz optymalizowanie długoterminowej nauki wybranych zagadnień na podstawie algorytmicznie wyznaczanych odstępów między powtórkami.

### Stos technologiczny

- React Native + Expo: wybrane głównie ze względu na Expo Go, które pozwala testować aplikację na prawdziwym urządzeniu.
- Stylowanie: NativeWind
- Supabase: uwierzytelnianie, synchronizacja talii, a w przyszłości być może także udostępnianie talii.

### Wymagania funkcjonalne

1. Użytkownicy muszą mieć możliwość rejestracji, logowania i wylogowania przy użyciu adresu e-mail oraz hasła.
2. Użytkownicy niezalogowani powinni mieć dostęp wyłącznie do trybu gościa.
3. Użytkownicy powinni mieć możliwość tworzenia, edytowania i usuwania fiszek, na przykład do nauki języków, gdzie przód karty zawiera słowo w języku docelowym, a tył jego definicję.
4. Użytkownicy powinni mieć możliwość tworzenia talii i dodawania do nich fiszek.
5. Talie powinny wyświetlać podstawowe informacje, takie jak liczba fiszek i liczba kart przypadających do powtórki danego dnia.
6. Aplikacja musi filtrować i wyświetlać listę kart do powtórki dla wybranej talii na podstawie zaplanowanej daty powtórki.
7. Podczas sesji powtórkowej użytkownik musi mieć możliwość dotknięcia lub przesunięcia karty, aby odkryć jej drugą stronę.
8. Po odkryciu odpowiedzi użytkownik musi wybrać jedną z czterech ocen własnej wiedzy: ponownie, trudne, dobrze lub łatwo.
9. Aplikacja musi automatycznie obliczać i aktualizować następną datę powtórki oraz odstęp między powtórkami, korzystając z wbudowanego algorytmu powtórek rozłożonych w czasie.
10. Po zakończeniu wszystkich kart do powtórki w talii aplikacja musi wyświetlić podsumowanie sesji zawierające statystyki, takie jak liczba powtórzonych kart i czas nauki.
11. Gdy użytkownik jest online, talie, fiszki i odstępy między powtórkami powinny być dwukierunkowo synchronizowane z backendem.

### Wymagania niefunkcjonalne

1. Animacje odwracania i odkrywania kart oraz ogólna obsługa gestów muszą działać z częstotliwością 60 FPS.
2. Aplikacja musi w pełni działać bez aktywnego połączenia z internetem, przechowując dane lokalnie i synchronizując zmiany po przywróceniu połączenia.
3. Aplikacja musi być w pełni kompatybilna z systemami iOS i Android oraz przetestowana na obu platformach.
4. Polityki Supabase Row Level Security muszą być egzekwowane.
5. Układy muszą poprawnie dostosowywać się do różnych rozmiarów ekranów urządzeń mobilnych.
