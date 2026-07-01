"use client";

import { track } from "@vercel/analytics";
import { useMemo, useState } from "react";

type Screen = "home" | "how" | "draft" | "rating" | "results" | "system";
type Position = "QB" | "RB" | "WR" | "TE" | "OL" | "DL" | "LB" | "CB" | "S" | "FLEX" | "DEF";

type Player = {
  id: string;
  name: string;
  team: string;
  decade: string;
  position: Position;
  stats: string;
  rating: number;
  offense: number;
  defense: number;
  star: number;
  chemistry: number;
};

type Spin = {
  team: string;
  decade: string;
};

const offensePositions: Position[] = ["QB", "RB", "WR", "TE", "OL", "FLEX"];
const rosterSlots: Position[] = ["QB", "RB", "WR", "WR", "TE", "OL", "FLEX", "DEF"];

const baseSpinDeck: Spin[] = [
  { team: "Dallas Cowboys", decade: "1990s" },
  { team: "San Francisco 49ers", decade: "1980s" },
  { team: "New England Patriots", decade: "2000s" },
  { team: "Pittsburgh Steelers", decade: "1970s" },
  { team: "Green Bay Packers", decade: "1960s" },
  { team: "Chicago Bears", decade: "1980s" },
  { team: "Baltimore Ravens", decade: "2000s" },
  { team: "Indianapolis Colts", decade: "2000s" },
  { team: "Miami Dolphins", decade: "1970s" },
  { team: "Minnesota Vikings", decade: "1990s" },
  { team: "Los Angeles Rams", decade: "2010s" },
  { team: "Kansas City Chiefs", decade: "2020s" },
  { team: "Detroit Lions", decade: "1990s" },
  { team: "Las Vegas Raiders", decade: "1970s" }
];

const players: Player[] = [
  { id: "aikman", name: "Troy Aikman", team: "Dallas Cowboys", decade: "1990s", position: "QB", stats: "3x champ, 6 Pro Bowls", rating: 92, offense: 94, defense: 40, star: 91, chemistry: 95 },
  { id: "emmitt", name: "Emmitt Smith", team: "Dallas Cowboys", decade: "1990s", position: "RB", stats: "NFL rush king, 1993 MVP", rating: 98, offense: 99, defense: 35, star: 98, chemistry: 96 },
  { id: "irvin", name: "Michael Irvin", team: "Dallas Cowboys", decade: "1990s", position: "WR", stats: "5x Pro Bowl, 3x champ", rating: 94, offense: 96, defense: 38, star: 95, chemistry: 94 },
  { id: "deion-cowboys", name: "Deion Sanders", team: "Dallas Cowboys", decade: "1990s", position: "CB", stats: "Lockdown CB, return threat", rating: 99, offense: 62, defense: 99, star: 100, chemistry: 89 },
  { id: "montana", name: "Joe Montana", team: "San Francisco 49ers", decade: "1980s", position: "QB", stats: "4x champ, 2x MVP", rating: 99, offense: 100, defense: 42, star: 100, chemistry: 99 },
  { id: "rice", name: "Jerry Rice", team: "San Francisco 49ers", decade: "1980s", position: "WR", stats: "Record-setting WR", rating: 100, offense: 100, defense: 36, star: 100, chemistry: 98 },
  { id: "craig", name: "Roger Craig", team: "San Francisco 49ers", decade: "1980s", position: "RB", stats: "1,000/1,000 season", rating: 91, offense: 94, defense: 35, star: 88, chemistry: 97 },
  { id: "lott", name: "Ronnie Lott", team: "San Francisco 49ers", decade: "1980s", position: "S", stats: "10x Pro Bowl, tone setter", rating: 98, offense: 44, defense: 100, star: 97, chemistry: 96 },
  { id: "brady", name: "Tom Brady", team: "New England Patriots", decade: "2000s", position: "QB", stats: "3x champ in decade", rating: 99, offense: 99, defense: 41, star: 100, chemistry: 99 },
  { id: "moss-pats", name: "Randy Moss", team: "New England Patriots", decade: "2000s", position: "WR", stats: "23 TD season", rating: 98, offense: 100, defense: 32, star: 100, chemistry: 92 },
  { id: "gronk-young", name: "Rob Gronkowski", team: "New England Patriots", decade: "2000s", position: "TE", stats: "Mismatch prototype", rating: 94, offense: 97, defense: 40, star: 96, chemistry: 95 },
  { id: "seymour", name: "Richard Seymour", team: "New England Patriots", decade: "2000s", position: "DL", stats: "5x Pro Bowl, 3x champ", rating: 94, offense: 38, defense: 97, star: 91, chemistry: 96 },
  { id: "bradshaw", name: "Terry Bradshaw", team: "Pittsburgh Steelers", decade: "1970s", position: "QB", stats: "4x champ, 1978 MVP", rating: 94, offense: 93, defense: 42, star: 94, chemistry: 97 },
  { id: "franco", name: "Franco Harris", team: "Pittsburgh Steelers", decade: "1970s", position: "RB", stats: "8x 1,000-yard rusher", rating: 94, offense: 95, defense: 38, star: 92, chemistry: 96 },
  { id: "meanjoe", name: "Mean Joe Greene", team: "Pittsburgh Steelers", decade: "1970s", position: "DL", stats: "2x DPOY, Steel Curtain", rating: 99, offense: 35, defense: 100, star: 98, chemistry: 99 },
  { id: "lambert", name: "Jack Lambert", team: "Pittsburgh Steelers", decade: "1970s", position: "LB", stats: "1976 DPOY", rating: 97, offense: 32, defense: 99, star: 96, chemistry: 98 },
  { id: "starr", name: "Bart Starr", team: "Green Bay Packers", decade: "1960s", position: "QB", stats: "5 titles, 2 SB MVPs", rating: 95, offense: 94, defense: 39, star: 93, chemistry: 99 },
  { id: "hornung", name: "Paul Hornung", team: "Green Bay Packers", decade: "1960s", position: "FLEX", stats: "1961 MVP, do-it-all back", rating: 91, offense: 93, defense: 46, star: 92, chemistry: 96 },
  { id: "nitschke", name: "Ray Nitschke", team: "Green Bay Packers", decade: "1960s", position: "LB", stats: "Iconic middle linebacker", rating: 95, offense: 30, defense: 98, star: 93, chemistry: 97 },
  { id: "davis", name: "Willie Davis", team: "Green Bay Packers", decade: "1960s", position: "DL", stats: "5x champ edge force", rating: 94, offense: 33, defense: 97, star: 91, chemistry: 96 },
  { id: "payton", name: "Walter Payton", team: "Chicago Bears", decade: "1980s", position: "RB", stats: "1985 champion, all-time great", rating: 99, offense: 99, defense: 44, star: 100, chemistry: 95 },
  { id: "ditka", name: "Mike Ditka", team: "Chicago Bears", decade: "1980s", position: "TE", stats: "Legendary Bears figure", rating: 89, offense: 90, defense: 44, star: 90, chemistry: 92 },
  { id: "singletary", name: "Mike Singletary", team: "Chicago Bears", decade: "1980s", position: "LB", stats: "2x DPOY, 10 Pro Bowls", rating: 98, offense: 31, defense: 100, star: 97, chemistry: 98 },
  { id: "dent", name: "Richard Dent", team: "Chicago Bears", decade: "1980s", position: "DL", stats: "SB XX MVP edge rusher", rating: 96, offense: 32, defense: 98, star: 95, chemistry: 96 },
  { id: "raylewis", name: "Ray Lewis", team: "Baltimore Ravens", decade: "2000s", position: "LB", stats: "2x DPOY, SB MVP", rating: 99, offense: 34, defense: 100, star: 100, chemistry: 97 },
  { id: "reed", name: "Ed Reed", team: "Baltimore Ravens", decade: "2000s", position: "S", stats: "2004 DPOY, ball hawk", rating: 99, offense: 45, defense: 100, star: 99, chemistry: 97 },
  { id: "suggs", name: "Terrell Suggs", team: "Baltimore Ravens", decade: "2000s", position: "DL", stats: "Edge power, 2011 DPOY", rating: 94, offense: 32, defense: 97, star: 92, chemistry: 95 },
  { id: "jamal", name: "Jamal Lewis", team: "Baltimore Ravens", decade: "2000s", position: "RB", stats: "2,066 rush yards in 2003", rating: 92, offense: 94, defense: 36, star: 91, chemistry: 91 },
  { id: "peyton", name: "Peyton Manning", team: "Indianapolis Colts", decade: "2000s", position: "QB", stats: "4 MVPs in decade", rating: 99, offense: 100, defense: 38, star: 100, chemistry: 98 },
  { id: "marvin", name: "Marvin Harrison", team: "Indianapolis Colts", decade: "2000s", position: "WR", stats: "143 catches in 2002", rating: 97, offense: 99, defense: 34, star: 96, chemistry: 98 },
  { id: "reggie", name: "Reggie Wayne", team: "Indianapolis Colts", decade: "2000s", position: "WR", stats: "6x Pro Bowl route ace", rating: 93, offense: 95, defense: 34, star: 91, chemistry: 97 },
  { id: "freeney", name: "Dwight Freeney", team: "Indianapolis Colts", decade: "2000s", position: "DL", stats: "Spin move pass rusher", rating: 95, offense: 31, defense: 98, star: 94, chemistry: 93 },
  { id: "griese", name: "Bob Griese", team: "Miami Dolphins", decade: "1970s", position: "QB", stats: "Perfect-season QB", rating: 92, offense: 91, defense: 40, star: 88, chemistry: 99 },
  { id: "csonka", name: "Larry Csonka", team: "Miami Dolphins", decade: "1970s", position: "RB", stats: "Power back, 2x champ", rating: 93, offense: 94, defense: 42, star: 90, chemistry: 98 },
  { id: "warfield", name: "Paul Warfield", team: "Miami Dolphins", decade: "1970s", position: "WR", stats: "Deep threat precision", rating: 94, offense: 96, defense: 35, star: 92, chemistry: 97 },
  { id: "buoniconti", name: "Nick Buoniconti", team: "Miami Dolphins", decade: "1970s", position: "LB", stats: "No-Name Defense captain", rating: 93, offense: 30, defense: 96, star: 89, chemistry: 99 },
  { id: "cunningham", name: "Randall Cunningham", team: "Minnesota Vikings", decade: "1990s", position: "QB", stats: "1998 scoring machine", rating: 92, offense: 96, defense: 36, star: 93, chemistry: 90 },
  { id: "cris", name: "Cris Carter", team: "Minnesota Vikings", decade: "1990s", position: "WR", stats: "Hands, routes, red zone", rating: 96, offense: 98, defense: 34, star: 95, chemistry: 94 },
  { id: "randle", name: "John Randle", team: "Minnesota Vikings", decade: "1990s", position: "DL", stats: "137.5 career sacks", rating: 96, offense: 32, defense: 98, star: 95, chemistry: 91 },
  { id: "moss-vikes", name: "Randy Moss", team: "Minnesota Vikings", decade: "1990s", position: "WR", stats: "1998 rookie eruption", rating: 99, offense: 100, defense: 34, star: 100, chemistry: 91 },
  { id: "donald", name: "Aaron Donald", team: "Los Angeles Rams", decade: "2010s", position: "DL", stats: "3x DPOY force", rating: 100, offense: 32, defense: 100, star: 100, chemistry: 95 },
  { id: "gurley", name: "Todd Gurley", team: "Los Angeles Rams", decade: "2010s", position: "RB", stats: "2017 OPOY", rating: 93, offense: 96, defense: 35, star: 92, chemistry: 90 },
  { id: "kupp", name: "Cooper Kupp", team: "Los Angeles Rams", decade: "2010s", position: "WR", stats: "Route volume specialist", rating: 91, offense: 94, defense: 36, star: 89, chemistry: 91 },
  { id: "ramsey", name: "Jalen Ramsey", team: "Los Angeles Rams", decade: "2010s", position: "CB", stats: "All-Pro press corner", rating: 96, offense: 42, defense: 98, star: 96, chemistry: 91 },
  { id: "mahomes", name: "Patrick Mahomes", team: "Kansas City Chiefs", decade: "2020s", position: "QB", stats: "2x MVP, multiple rings", rating: 99, offense: 100, defense: 39, star: 100, chemistry: 97 },
  { id: "kelce", name: "Travis Kelce", team: "Kansas City Chiefs", decade: "2020s", position: "TE", stats: "Playoff record breaker", rating: 98, offense: 100, defense: 38, star: 98, chemistry: 98 },
  { id: "chrisjones", name: "Chris Jones", team: "Kansas City Chiefs", decade: "2020s", position: "DL", stats: "Interior pressure star", rating: 97, offense: 34, defense: 99, star: 96, chemistry: 95 },
  { id: "mcduffie", name: "Trent McDuffie", team: "Kansas City Chiefs", decade: "2020s", position: "CB", stats: "Modern nickel eraser", rating: 90, offense: 39, defense: 94, star: 86, chemistry: 93 },
  { id: "barry", name: "Barry Sanders", team: "Detroit Lions", decade: "1990s", position: "RB", stats: "1997 MVP, 2,053 yards", rating: 100, offense: 100, defense: 35, star: 100, chemistry: 90 },
  { id: "herman", name: "Herman Moore", team: "Detroit Lions", decade: "1990s", position: "WR", stats: "123 catches in 1995", rating: 91, offense: 94, defense: 34, star: 88, chemistry: 89 },
  { id: "spielman", name: "Chris Spielman", team: "Detroit Lions", decade: "1990s", position: "LB", stats: "Tackle machine", rating: 90, offense: 31, defense: 94, star: 87, chemistry: 91 },
  { id: "porcher", name: "Robert Porcher", team: "Detroit Lions", decade: "1990s", position: "DL", stats: "3x Pro Bowl edge", rating: 88, offense: 30, defense: 91, star: 84, chemistry: 88 },
  { id: "stabler", name: "Ken Stabler", team: "Las Vegas Raiders", decade: "1970s", position: "QB", stats: "1974 MVP, ring leader", rating: 94, offense: 94, defense: 39, star: 93, chemistry: 95 },
  { id: "biletnikoff", name: "Fred Biletnikoff", team: "Las Vegas Raiders", decade: "1970s", position: "WR", stats: "SB XI MVP", rating: 93, offense: 95, defense: 35, star: 91, chemistry: 95 },
  { id: "art-shell", name: "Art Shell", team: "Las Vegas Raiders", decade: "1970s", position: "OL", stats: "8x Pro Bowl tackle", rating: 96, offense: 98, defense: 40, star: 93, chemistry: 96 },
  { id: "willie-brown", name: "Willie Brown", team: "Las Vegas Raiders", decade: "1970s", position: "CB", stats: "Hall of Fame corner", rating: 96, offense: 42, defense: 98, star: 94, chemistry: 95 }
];

const offenseRosterAddons: Player[] = [
  { id: "novacek", name: "Jay Novacek", team: "Dallas Cowboys", decade: "1990s", position: "TE", stats: "5x Pro Bowl safety valve", rating: 89, offense: 91, defense: 30, star: 86, chemistry: 95 },
  { id: "larry-allen", name: "Larry Allen", team: "Dallas Cowboys", decade: "1990s", position: "OL", stats: "11x Pro Bowl power guard", rating: 99, offense: 100, defense: 34, star: 96, chemistry: 96 },
  { id: "daryl-johnston", name: "Daryl Johnston", team: "Dallas Cowboys", decade: "1990s", position: "FLEX", stats: "All-Pro lead blocker", rating: 86, offense: 88, defense: 40, star: 82, chemistry: 97 },
  { id: "harper", name: "Alvin Harper", team: "Dallas Cowboys", decade: "1990s", position: "WR", stats: "Vertical playoff threat", rating: 84, offense: 87, defense: 28, star: 80, chemistry: 90 },
  { id: "rathman", name: "Tom Rathman", team: "San Francisco 49ers", decade: "1980s", position: "FLEX", stats: "West Coast fullback", rating: 87, offense: 89, defense: 38, star: 82, chemistry: 98 },
  { id: "clark", name: "Dwight Clark", team: "San Francisco 49ers", decade: "1980s", position: "WR", stats: "The Catch, 2x Pro Bowl", rating: 91, offense: 93, defense: 30, star: 91, chemistry: 97 },
  { id: "cross", name: "Randy Cross", team: "San Francisco 49ers", decade: "1980s", position: "OL", stats: "3x Pro Bowl interior anchor", rating: 90, offense: 92, defense: 32, star: 86, chemistry: 96 },
  { id: "francis", name: "Russ Francis", team: "San Francisco 49ers", decade: "1980s", position: "TE", stats: "Championship-era tight end", rating: 84, offense: 86, defense: 31, star: 79, chemistry: 90 },
  { id: "welker", name: "Wes Welker", team: "New England Patriots", decade: "2000s", position: "WR", stats: "Slot volume machine", rating: 94, offense: 97, defense: 29, star: 91, chemistry: 97 },
  { id: "faulk-pats", name: "Kevin Faulk", team: "New England Patriots", decade: "2000s", position: "RB", stats: "Third-down weapon", rating: 86, offense: 89, defense: 35, star: 82, chemistry: 97 },
  { id: "light", name: "Matt Light", team: "New England Patriots", decade: "2000s", position: "OL", stats: "3x champion left tackle", rating: 90, offense: 92, defense: 31, star: 86, chemistry: 96 },
  { id: "brown-pats", name: "Troy Brown", team: "New England Patriots", decade: "2000s", position: "FLEX", stats: "Do-everything Patriot", rating: 87, offense: 89, defense: 50, star: 85, chemistry: 99 },
  { id: "swann", name: "Lynn Swann", team: "Pittsburgh Steelers", decade: "1970s", position: "WR", stats: "SB X MVP, 3x Pro Bowl", rating: 92, offense: 94, defense: 28, star: 94, chemistry: 96 },
  { id: "stallworth", name: "John Stallworth", team: "Pittsburgh Steelers", decade: "1970s", position: "WR", stats: "Big-play Hall of Famer", rating: 93, offense: 95, defense: 29, star: 92, chemistry: 96 },
  { id: "webster", name: "Mike Webster", team: "Pittsburgh Steelers", decade: "1970s", position: "OL", stats: "9x Pro Bowl center", rating: 98, offense: 99, defense: 32, star: 95, chemistry: 98 },
  { id: "grossman", name: "Randy Grossman", team: "Pittsburgh Steelers", decade: "1970s", position: "TE", stats: "Reliable title-era TE", rating: 82, offense: 84, defense: 32, star: 76, chemistry: 92 },
  { id: "jim-taylor", name: "Jim Taylor", team: "Green Bay Packers", decade: "1960s", position: "RB", stats: "1962 MVP power back", rating: 96, offense: 97, defense: 34, star: 94, chemistry: 98 },
  { id: "boyd-dowler", name: "Boyd Dowler", team: "Green Bay Packers", decade: "1960s", position: "WR", stats: "2x Pro Bowl receiver", rating: 87, offense: 89, defense: 28, star: 82, chemistry: 95 },
  { id: "forrest-gregg", name: "Forrest Gregg", team: "Green Bay Packers", decade: "1960s", position: "OL", stats: "9x Pro Bowl tackle", rating: 98, offense: 99, defense: 34, star: 95, chemistry: 99 },
  { id: "max-mcgee", name: "Max McGee", team: "Green Bay Packers", decade: "1960s", position: "WR", stats: "Super Bowl I hero", rating: 85, offense: 87, defense: 28, star: 84, chemistry: 94 },
  { id: "mcmahon", name: "Jim McMahon", team: "Chicago Bears", decade: "1980s", position: "QB", stats: "1985 title starter", rating: 86, offense: 88, defense: 35, star: 86, chemistry: 94 },
  { id: "gault", name: "Willie Gault", team: "Chicago Bears", decade: "1980s", position: "WR", stats: "World-class speed", rating: 86, offense: 89, defense: 30, star: 84, chemistry: 89 },
  { id: "hilgenberg", name: "Jay Hilgenberg", team: "Chicago Bears", decade: "1980s", position: "OL", stats: "7x Pro Bowl center", rating: 92, offense: 94, defense: 31, star: 88, chemistry: 94 },
  { id: "suhey", name: "Matt Suhey", team: "Chicago Bears", decade: "1980s", position: "FLEX", stats: "Payton-era fullback", rating: 82, offense: 84, defense: 38, star: 77, chemistry: 93 },
  { id: "heap", name: "Todd Heap", team: "Baltimore Ravens", decade: "2000s", position: "TE", stats: "2x Pro Bowl target", rating: 88, offense: 91, defense: 31, star: 85, chemistry: 91 },
  { id: "mason", name: "Derrick Mason", team: "Baltimore Ravens", decade: "2000s", position: "WR", stats: "Chain-moving WR", rating: 88, offense: 91, defense: 29, star: 84, chemistry: 91 },
  { id: "ogden", name: "Jonathan Ogden", team: "Baltimore Ravens", decade: "2000s", position: "OL", stats: "11x Pro Bowl left tackle", rating: 99, offense: 100, defense: 34, star: 96, chemistry: 96 },
  { id: "flacco", name: "Joe Flacco", team: "Baltimore Ravens", decade: "2000s", position: "QB", stats: "Big-arm playoff passer", rating: 84, offense: 86, defense: 30, star: 82, chemistry: 86 },
  { id: "edgerrin", name: "Edgerrin James", team: "Indianapolis Colts", decade: "2000s", position: "RB", stats: "2x rushing champ", rating: 95, offense: 97, defense: 32, star: 93, chemistry: 97 },
  { id: "dallas-clark", name: "Dallas Clark", team: "Indianapolis Colts", decade: "2000s", position: "TE", stats: "1,100-yard TE season", rating: 90, offense: 93, defense: 29, star: 88, chemistry: 96 },
  { id: "tarik-glenn", name: "Tarik Glenn", team: "Indianapolis Colts", decade: "2000s", position: "OL", stats: "3x Pro Bowl blindside", rating: 91, offense: 93, defense: 31, star: 87, chemistry: 96 },
  { id: "stokley", name: "Brandon Stokley", team: "Indianapolis Colts", decade: "2000s", position: "FLEX", stats: "Slot TD specialist", rating: 84, offense: 87, defense: 28, star: 80, chemistry: 92 },
  { id: "mercury", name: "Mercury Morris", team: "Miami Dolphins", decade: "1970s", position: "RB", stats: "Perfect-season speed back", rating: 90, offense: 92, defense: 32, star: 88, chemistry: 98 },
  { id: "kuechenberg", name: "Bob Kuechenberg", team: "Miami Dolphins", decade: "1970s", position: "OL", stats: "6x Pro Bowl guard", rating: 93, offense: 95, defense: 32, star: 89, chemistry: 97 },
  { id: "mandich", name: "Jim Mandich", team: "Miami Dolphins", decade: "1970s", position: "TE", stats: "Perfect-season TE", rating: 82, offense: 84, defense: 32, star: 76, chemistry: 94 },
  { id: "kiick", name: "Jim Kiick", team: "Miami Dolphins", decade: "1970s", position: "FLEX", stats: "Versatile backfield piece", rating: 84, offense: 87, defense: 36, star: 80, chemistry: 95 },
  { id: "robert-smith", name: "Robert Smith", team: "Minnesota Vikings", decade: "1990s", position: "RB", stats: "Explosive 1,000-yard back", rating: 88, offense: 91, defense: 31, star: 85, chemistry: 90 },
  { id: "steve-jordan", name: "Steve Jordan", team: "Minnesota Vikings", decade: "1990s", position: "TE", stats: "6x Pro Bowl tight end", rating: 90, offense: 92, defense: 31, star: 87, chemistry: 91 },
  { id: "randall-mcdaniel", name: "Randall McDaniel", team: "Minnesota Vikings", decade: "1990s", position: "OL", stats: "12x Pro Bowl guard", rating: 99, offense: 100, defense: 34, star: 96, chemistry: 95 },
  { id: "jake-reed", name: "Jake Reed", team: "Minnesota Vikings", decade: "1990s", position: "WR", stats: "Four straight 1,000-yard years", rating: 87, offense: 90, defense: 29, star: 83, chemistry: 91 },
  { id: "goff", name: "Jared Goff", team: "Los Angeles Rams", decade: "2010s", position: "QB", stats: "Super Bowl run passer", rating: 87, offense: 90, defense: 29, star: 84, chemistry: 88 },
  { id: "whitworth", name: "Andrew Whitworth", team: "Los Angeles Rams", decade: "2010s", position: "OL", stats: "All-Pro left tackle", rating: 95, offense: 97, defense: 31, star: 92, chemistry: 93 },
  { id: "robert-woods", name: "Robert Woods", team: "Los Angeles Rams", decade: "2010s", position: "WR", stats: "Blocking plus routes", rating: 88, offense: 91, defense: 32, star: 84, chemistry: 94 },
  { id: "higbee", name: "Tyler Higbee", team: "Los Angeles Rams", decade: "2010s", position: "TE", stats: "Play-action target", rating: 84, offense: 87, defense: 30, star: 79, chemistry: 89 },
  { id: "pacheco", name: "Isiah Pacheco", team: "Kansas City Chiefs", decade: "2020s", position: "RB", stats: "Contact-balance runner", rating: 86, offense: 89, defense: 32, star: 84, chemistry: 93 },
  { id: "tyreek-2020s", name: "Tyreek Hill", team: "Kansas City Chiefs", decade: "2020s", position: "WR", stats: "Game-breaking speed", rating: 97, offense: 99, defense: 28, star: 98, chemistry: 95 },
  { id: "thuney", name: "Joe Thuney", team: "Kansas City Chiefs", decade: "2020s", position: "OL", stats: "All-Pro pass protector", rating: 94, offense: 96, defense: 31, star: 90, chemistry: 95 },
  { id: "rashee", name: "Rashee Rice", team: "Kansas City Chiefs", decade: "2020s", position: "FLEX", stats: "YAC slot weapon", rating: 84, offense: 87, defense: 28, star: 82, chemistry: 88 },
  { id: "scott-mitchell", name: "Scott Mitchell", team: "Detroit Lions", decade: "1990s", position: "QB", stats: "1995 passing surge", rating: 82, offense: 85, defense: 28, star: 78, chemistry: 84 },
  { id: "brett-perriman", name: "Brett Perriman", team: "Detroit Lions", decade: "1990s", position: "WR", stats: "108 catches in 1995", rating: 86, offense: 89, defense: 28, star: 82, chemistry: 88 },
  { id: "lomas-brown", name: "Lomas Brown", team: "Detroit Lions", decade: "1990s", position: "OL", stats: "7x Pro Bowl tackle", rating: 93, offense: 95, defense: 31, star: 89, chemistry: 90 },
  { id: "johnnie-morton", name: "Johnnie Morton", team: "Detroit Lions", decade: "1990s", position: "FLEX", stats: "Reliable WR2", rating: 84, offense: 87, defense: 28, star: 79, chemistry: 87 },
  { id: "cliff-branch", name: "Cliff Branch", team: "Las Vegas Raiders", decade: "1970s", position: "WR", stats: "Deep-speed champion", rating: 94, offense: 96, defense: 28, star: 93, chemistry: 95 },
  { id: "mark-van-eeghen", name: "Mark van Eeghen", team: "Las Vegas Raiders", decade: "1970s", position: "RB", stats: "Power runner, 2x champ", rating: 88, offense: 90, defense: 34, star: 84, chemistry: 94 },
  { id: "dave-casper", name: "Dave Casper", team: "Las Vegas Raiders", decade: "1970s", position: "TE", stats: "Hall of Fame tight end", rating: 95, offense: 97, defense: 31, star: 94, chemistry: 96 },
  { id: "gene-upshaw", name: "Gene Upshaw", team: "Las Vegas Raiders", decade: "1970s", position: "OL", stats: "7x Pro Bowl guard", rating: 97, offense: 99, defense: 32, star: 94, chemistry: 96 }
];

type OffenseSeed = {
  team: string;
  decade: string;
  cards: [string, Position, string, number, number, number, number][];
};

const expandedRosterSeeds: OffenseSeed[] = [
  {
    team: "Buffalo Bills",
    decade: "1990s",
    cards: [
      ["Jim Kelly", "QB", "K-Gun field general", 94, 95, 94, 96],
      ["Thurman Thomas", "RB", "MVP dual-threat back", 97, 98, 97, 96],
      ["Andre Reed", "WR", "Middle-field chain mover", 94, 96, 93, 95],
      ["James Lofton", "WR", "Deep Hall of Fame target", 91, 93, 91, 91],
      ["Kent Hull", "OL", "No-huddle anchor", 92, 94, 88, 95],
      ["Kenneth Davis", "FLEX", "Reliable playoff back", 84, 86, 80, 90]
    ]
  },
  {
    team: "Buffalo Bills",
    decade: "2020s",
    cards: [
      ["Josh Allen", "QB", "MVP-level power passer", 98, 100, 99, 94],
      ["James Cook", "RB", "Explosive modern runner", 87, 90, 84, 90],
      ["Stefon Diggs", "WR", "All-Pro route winner", 95, 97, 95, 91],
      ["Gabriel Davis", "WR", "Playoff vertical threat", 84, 87, 82, 86],
      ["Dion Dawkins", "OL", "Pro Bowl left tackle", 90, 92, 87, 92],
      ["Dalton Kincaid", "TE", "Space tight end", 84, 87, 82, 87]
    ]
  },
  {
    team: "Denver Broncos",
    decade: "1990s",
    cards: [
      ["John Elway", "QB", "Late-prime title passer", 97, 98, 98, 96],
      ["Terrell Davis", "RB", "2,000-yard MVP back", 98, 99, 98, 97],
      ["Rod Smith", "WR", "Undrafted star receiver", 91, 93, 89, 94],
      ["Shannon Sharpe", "TE", "Prototype receiving TE", 96, 98, 95, 95],
      ["Gary Zimmerman", "OL", "Hall of Fame tackle", 96, 98, 94, 95],
      ["Ed McCaffrey", "FLEX", "Tough playoff target", 88, 90, 86, 93]
    ]
  },
  {
    team: "New York Giants",
    decade: "1980s",
    cards: [
      ["Phil Simms", "QB", "Super Bowl MVP passer", 90, 91, 89, 93],
      ["Joe Morris", "RB", "Compact scoring runner", 89, 91, 86, 91],
      ["Mark Bavaro", "TE", "Power tight end", 93, 95, 91, 94],
      ["Lionel Manuel", "WR", "Reliable title target", 83, 85, 80, 88],
      ["Brad Benson", "OL", "Pro Bowl tackle", 89, 91, 86, 91],
      ["Maurice Carthon", "FLEX", "Physical fullback", 82, 84, 78, 90]
    ]
  },
  {
    team: "Philadelphia Eagles",
    decade: "2000s",
    cards: [
      ["Donovan McNabb", "QB", "Dual-threat franchise QB", 93, 95, 94, 91],
      ["Brian Westbrook", "RB", "Elite receiving back", 94, 97, 93, 92],
      ["Terrell Owens", "WR", "Super Bowl run force", 96, 98, 98, 88],
      ["DeSean Jackson", "WR", "Home-run speed", 91, 94, 92, 86],
      ["Tra Thomas", "OL", "Blindside Pro Bowler", 91, 93, 88, 92],
      ["Brent Celek", "TE", "Complete tight end", 84, 86, 80, 90]
    ]
  },
  {
    team: "Washington Commanders",
    decade: "1980s",
    cards: [
      ["Joe Theismann", "QB", "MVP title-era QB", 91, 92, 90, 94],
      ["John Riggins", "RB", "Diesel playoff hammer", 95, 96, 94, 96],
      ["Art Monk", "WR", "Hall of Fame volume target", 94, 96, 92, 96],
      ["Gary Clark", "WR", "Explosive Fun Bunch WR", 90, 92, 88, 92],
      ["Joe Jacoby", "OL", "Hogs left tackle", 96, 98, 93, 97],
      ["Clint Didier", "TE", "Red-zone tight end", 82, 84, 78, 89]
    ]
  },
  {
    team: "Seattle Seahawks",
    decade: "2010s",
    cards: [
      ["Russell Wilson", "QB", "Moon-ball creator", 95, 97, 96, 92],
      ["Marshawn Lynch", "RB", "Beast Mode finisher", 96, 97, 97, 94],
      ["Doug Baldwin", "WR", "Precision slot winner", 90, 93, 88, 93],
      ["Tyler Lockett", "WR", "Efficient deep separator", 89, 92, 87, 91],
      ["Max Unger", "OL", "Super Bowl center", 90, 92, 86, 93],
      ["Jimmy Graham", "TE", "Red-zone mismatch", 88, 91, 88, 86]
    ]
  },
  {
    team: "Arizona Cardinals",
    decade: "2000s",
    cards: [
      ["Kurt Warner", "QB", "Playoff passing explosion", 94, 97, 94, 92],
      ["Edgerrin James", "RB", "Veteran all-purpose back", 88, 90, 86, 89],
      ["Larry Fitzgerald", "WR", "Postseason catch machine", 98, 99, 99, 95],
      ["Anquan Boldin", "WR", "Physical possession star", 93, 95, 91, 94],
      ["L.J. Shelton", "OL", "Long-time left tackle", 84, 86, 80, 87],
      ["Steve Breaston", "FLEX", "Slot and return spark", 83, 86, 80, 86]
    ]
  },
  {
    team: "Tampa Bay Buccaneers",
    decade: "2020s",
    cards: [
      ["Tom Brady", "QB", "Late-career title commander", 98, 99, 100, 96],
      ["Leonard Fournette", "RB", "Playoff power back", 87, 90, 86, 90],
      ["Mike Evans", "WR", "Touchdown boundary star", 95, 97, 94, 92],
      ["Chris Godwin", "WR", "Slot-force receiver", 91, 94, 89, 91],
      ["Tristan Wirfs", "OL", "Elite modern tackle", 97, 99, 94, 94],
      ["Rob Gronkowski", "TE", "Playoff mismatch TE", 94, 96, 96, 94]
    ]
  },
  {
    team: "New Orleans Saints",
    decade: "2000s",
    cards: [
      ["Drew Brees", "QB", "Record-volume passer", 98, 100, 98, 97],
      ["Deuce McAllister", "RB", "Powerful franchise back", 90, 92, 88, 91],
      ["Marques Colston", "WR", "Big slot target", 90, 93, 88, 95],
      ["Reggie Bush", "FLEX", "Space-play weapon", 88, 91, 89, 88],
      ["Jahri Evans", "OL", "All-Pro guard", 97, 99, 94, 96],
      ["Jeremy Shockey", "TE", "Title-run tight end", 86, 88, 84, 88]
    ]
  },
  {
    team: "Atlanta Falcons",
    decade: "2010s",
    cards: [
      ["Matt Ryan", "QB", "2016 MVP passer", 95, 97, 94, 94],
      ["Devonta Freeman", "RB", "Super Bowl run back", 88, 91, 85, 90],
      ["Julio Jones", "WR", "Prime size-speed monster", 99, 100, 99, 92],
      ["Roddy White", "WR", "Veteran WR1", 91, 93, 89, 92],
      ["Alex Mack", "OL", "All-Pro center", 94, 96, 91, 94],
      ["Tony Gonzalez", "TE", "Late-prime Hall TE", 94, 96, 95, 91]
    ]
  },
  {
    team: "Carolina Panthers",
    decade: "2010s",
    cards: [
      ["Cam Newton", "QB", "MVP power creator", 97, 98, 99, 91],
      ["Christian McCaffrey", "RB", "1,000/1,000 weapon", 98, 100, 98, 90],
      ["D.J. Moore", "WR", "YAC receiver", 88, 91, 85, 88],
      ["Greg Olsen", "TE", "Three-level tight end", 92, 94, 90, 93],
      ["Ryan Kalil", "OL", "All-Pro center", 93, 95, 90, 94],
      ["Jonathan Stewart", "FLEX", "Power backfield piece", 86, 88, 83, 90]
    ]
  },
  {
    team: "Cincinnati Bengals",
    decade: "2020s",
    cards: [
      ["Joe Burrow", "QB", "Playoff rhythm passer", 96, 98, 96, 93],
      ["Joe Mixon", "RB", "Workhorse back", 88, 91, 86, 89],
      ["Ja'Marr Chase", "WR", "Explosive alpha receiver", 97, 99, 98, 93],
      ["Tee Higgins", "WR", "Contested-catch WR2", 90, 93, 88, 91],
      ["Orlando Brown Jr.", "OL", "Massive edge protector", 89, 91, 86, 90],
      ["Tyler Boyd", "FLEX", "Slot chain mover", 86, 88, 82, 91]
    ]
  },
  {
    team: "Cleveland Browns",
    decade: "1950s",
    cards: [
      ["Otto Graham", "QB", "Dynasty-era winner", 98, 98, 99, 99],
      ["Jim Brown", "RB", "All-time power back", 100, 100, 100, 96],
      ["Dante Lavelli", "WR", "Hall of Fame end", 93, 95, 92, 96],
      ["Mac Speedie", "WR", "Route technician", 91, 93, 90, 95],
      ["Lou Groza", "OL", "Two-way tackle legend", 94, 96, 92, 98],
      ["Dub Jones", "FLEX", "Multi-role scoring back", 88, 90, 86, 94]
    ]
  },
  {
    team: "New York Jets",
    decade: "1960s",
    cards: [
      ["Joe Namath", "QB", "Guarantee-era passer", 94, 95, 96, 92],
      ["Matt Snell", "RB", "Super Bowl power back", 88, 90, 85, 93],
      ["Don Maynard", "WR", "Hall of Fame deep threat", 94, 96, 93, 93],
      ["George Sauer", "WR", "Smooth AFL target", 88, 90, 85, 91],
      ["Winston Hill", "OL", "Hall of Fame tackle", 94, 96, 91, 94],
      ["Emerson Boozer", "FLEX", "Scoring backfield weapon", 86, 88, 84, 91]
    ]
  },
  {
    team: "Los Angeles Chargers",
    decade: "2000s",
    cards: [
      ["Philip Rivers", "QB", "High-volume pocket passer", 93, 95, 91, 90],
      ["LaDainian Tomlinson", "RB", "Record-setting MVP back", 100, 100, 100, 95],
      ["Vincent Jackson", "WR", "Vertical size receiver", 90, 93, 88, 88],
      ["Keenan McCardell", "WR", "Veteran route target", 86, 88, 83, 90],
      ["Kris Dielman", "OL", "Mauling Pro Bowl guard", 92, 94, 88, 92],
      ["Antonio Gates", "TE", "Basketball-body TE legend", 98, 99, 98, 93]
    ]
  },
  {
    team: "Tennessee Titans",
    decade: "1990s",
    cards: [
      ["Steve McNair", "QB", "Tough dual-threat leader", 92, 94, 92, 94],
      ["Eddie George", "RB", "Workhorse power back", 92, 94, 90, 94],
      ["Derrick Mason", "WR", "Reliable separator", 87, 90, 84, 90],
      ["Yancey Thigpen", "WR", "Big-play target", 86, 89, 84, 86],
      ["Bruce Matthews", "OL", "All-time line great", 99, 100, 97, 98],
      ["Frank Wycheck", "TE", "Music City tight end", 88, 90, 84, 92]
    ]
  },
  {
    team: "Houston Texans",
    decade: "2010s",
    cards: [
      ["Deshaun Watson", "QB", "Escape-play creator", 90, 93, 90, 84],
      ["Arian Foster", "RB", "Zone-run superstar", 94, 96, 92, 91],
      ["Andre Johnson", "WR", "Physical WR1", 96, 98, 95, 91],
      ["DeAndre Hopkins", "WR", "Catch-radius artist", 97, 99, 97, 90],
      ["Duane Brown", "OL", "Pro Bowl blindside", 92, 94, 88, 91],
      ["Owen Daniels", "TE", "Play-action tight end", 85, 87, 81, 90]
    ]
  },
  {
    team: "Jacksonville Jaguars",
    decade: "1990s",
    cards: [
      ["Mark Brunell", "QB", "Lefty playoff passer", 90, 92, 88, 90],
      ["Fred Taylor", "RB", "Explosive franchise back", 94, 96, 92, 89],
      ["Jimmy Smith", "WR", "Pro Bowl route star", 94, 96, 92, 92],
      ["Keenan McCardell", "WR", "Thunder-and-lightning WR", 90, 92, 87, 92],
      ["Tony Boselli", "OL", "Elite left tackle", 98, 99, 96, 93],
      ["Pete Mitchell", "TE", "Reliable receiving TE", 82, 84, 78, 87]
    ]
  },
  {
    team: "Dallas Cowboys",
    decade: "1970s",
    cards: [
      ["Roger Staubach", "QB", "Captain Comeback", 97, 98, 98, 97],
      ["Tony Dorsett", "RB", "Speed title back", 96, 98, 95, 94],
      ["Drew Pearson", "WR", "Clutch original 88", 93, 95, 92, 95],
      ["Billy Joe DuPree", "TE", "Complete title TE", 86, 88, 82, 92],
      ["Rayfield Wright", "OL", "Hall of Fame tackle", 97, 99, 94, 96],
      ["Preston Pearson", "FLEX", "Playoff receiving back", 84, 86, 81, 92]
    ]
  },
  {
    team: "Green Bay Packers",
    decade: "2010s",
    cards: [
      ["Aaron Rodgers", "QB", "MVP efficiency machine", 100, 100, 100, 94],
      ["Aaron Jones", "RB", "Explosive receiving back", 89, 92, 87, 91],
      ["Davante Adams", "WR", "Release-game master", 98, 100, 98, 94],
      ["Jordy Nelson", "WR", "Sideline timing target", 92, 95, 90, 94],
      ["David Bakhtiari", "OL", "Elite pass protector", 97, 99, 94, 94],
      ["Randall Cobb", "FLEX", "Slot and gadget spark", 88, 91, 86, 92]
    ]
  },
  {
    team: "Kansas City Chiefs",
    decade: "2010s",
    cards: [
      ["Alex Smith", "QB", "Efficient playoff passer", 87, 89, 84, 92],
      ["Jamaal Charles", "RB", "Yards-per-carry star", 97, 99, 96, 90],
      ["Tyreek Hill", "WR", "Game-breaking speed", 96, 99, 97, 91],
      ["Dwayne Bowe", "WR", "Physical WR1", 87, 89, 84, 88],
      ["Eric Fisher", "OL", "Former top-pick tackle", 86, 88, 82, 88],
      ["Travis Kelce", "TE", "Route-running tight end", 97, 99, 97, 95]
    ]
  },
  {
    team: "New England Patriots",
    decade: "2010s",
    cards: [
      ["Tom Brady", "QB", "Second-dynasty commander", 100, 100, 100, 99],
      ["James White", "RB", "Super Bowl receiving back", 87, 90, 86, 96],
      ["Julian Edelman", "WR", "Playoff slot fighter", 91, 94, 90, 97],
      ["Brandin Cooks", "WR", "Vertical separator", 89, 92, 88, 87],
      ["Nate Solder", "OL", "Title-era left tackle", 89, 91, 86, 93],
      ["Rob Gronkowski", "TE", "Peak matchup breaker", 100, 100, 100, 97]
    ]
  },
  {
    team: "Los Angeles Rams",
    decade: "1990s",
    cards: [
      ["Kurt Warner", "QB", "Greatest Show passer", 97, 100, 97, 95],
      ["Marshall Faulk", "RB", "MVP receiving back", 100, 100, 100, 96],
      ["Isaac Bruce", "WR", "Smooth vertical WR", 95, 97, 93, 94],
      ["Torry Holt", "WR", "Route-speed star", 94, 97, 92, 93],
      ["Orlando Pace", "OL", "Hall of Fame tackle", 99, 100, 97, 95],
      ["Az-Zahir Hakim", "FLEX", "Slot explosive piece", 86, 89, 84, 88]
    ]
  },
  {
    team: "San Francisco 49ers",
    decade: "1990s",
    cards: [
      ["Steve Young", "QB", "MVP dual-threat passer", 99, 100, 99, 96],
      ["Ricky Watters", "RB", "Versatile title back", 90, 93, 88, 92],
      ["Jerry Rice", "WR", "Prime record-breaker", 100, 100, 100, 97],
      ["Terrell Owens", "WR", "Young explosive target", 92, 95, 92, 88],
      ["Jesse Sapolu", "OL", "Multi-ring line anchor", 91, 93, 87, 95],
      ["Brent Jones", "TE", "Four-time Pro Bowl TE", 91, 93, 88, 95]
    ]
  },
  {
    team: "Pittsburgh Steelers",
    decade: "2000s",
    cards: [
      ["Ben Roethlisberger", "QB", "Two-ring play extender", 94, 96, 93, 93],
      ["Jerome Bettis", "RB", "Power title finisher", 91, 92, 91, 94],
      ["Hines Ward", "WR", "Physical Super Bowl MVP", 92, 94, 90, 96],
      ["Santonio Holmes", "WR", "Toe-tap playoff hero", 88, 91, 88, 89],
      ["Alan Faneca", "OL", "Hall of Fame guard", 98, 99, 95, 96],
      ["Heath Miller", "TE", "Reliable complete TE", 88, 90, 84, 94]
    ]
  },
  {
    team: "Chicago Bears",
    decade: "2000s",
    cards: [
      ["Jay Cutler", "QB", "Big-arm creator", 84, 87, 84, 82],
      ["Matt Forte", "RB", "All-purpose workhorse", 92, 95, 90, 91],
      ["Brandon Marshall", "WR", "Contested-catch monster", 94, 96, 94, 88],
      ["Alshon Jeffery", "WR", "Boundary jump-ball target", 88, 91, 86, 87],
      ["Olin Kreutz", "OL", "Six-time Pro Bowl center", 93, 95, 89, 93],
      ["Greg Olsen", "TE", "Young receiving TE", 87, 90, 84, 86]
    ]
  },
  {
    team: "Baltimore Ravens",
    decade: "2010s",
    cards: [
      ["Lamar Jackson", "QB", "Unanimous MVP runner", 99, 100, 100, 90],
      ["Ray Rice", "RB", "Receiving-back engine", 91, 94, 88, 90],
      ["Anquan Boldin", "WR", "Playoff possession force", 90, 92, 88, 92],
      ["Torrey Smith", "WR", "Vertical field stretcher", 86, 89, 84, 86],
      ["Marshal Yanda", "OL", "Hall-level guard", 98, 99, 94, 96],
      ["Mark Andrews", "TE", "Red-zone chain mover", 92, 94, 90, 91]
    ]
  },
  {
    team: "Indianapolis Colts",
    decade: "2010s",
    cards: [
      ["Andrew Luck", "QB", "High-end comeback passer", 94, 96, 94, 90],
      ["Jonathan Taylor", "RB", "Late-decade rushing star", 93, 96, 92, 88],
      ["T.Y. Hilton", "WR", "Explosive deep separator", 92, 95, 90, 91],
      ["Reggie Wayne", "WR", "Veteran route master", 91, 93, 89, 93],
      ["Quenton Nelson", "OL", "Instant All-Pro guard", 98, 99, 95, 94],
      ["Jack Doyle", "TE", "Reliable underneath TE", 84, 86, 80, 90]
    ]
  },
  {
    team: "Miami Dolphins",
    decade: "1980s",
    cards: [
      ["Dan Marino", "QB", "Record-shattering passer", 100, 100, 100, 92],
      ["Tony Nathan", "RB", "Receiving back weapon", 87, 90, 84, 91],
      ["Mark Duper", "WR", "Marks Brother speed", 92, 95, 90, 91],
      ["Mark Clayton", "WR", "Touchdown machine", 93, 96, 91, 92],
      ["Dwight Stephenson", "OL", "All-time center", 99, 100, 97, 95],
      ["Bruce Hardy", "TE", "Steady Marino target", 83, 85, 79, 90]
    ]
  },
  {
    team: "Minnesota Vikings",
    decade: "2000s",
    cards: [
      ["Daunte Culpepper", "QB", "Peak power passer", 92, 95, 92, 87],
      ["Adrian Peterson", "RB", "MVP rushing force", 100, 100, 100, 90],
      ["Randy Moss", "WR", "Early-decade alien", 98, 100, 99, 89],
      ["Percy Harvin", "WR", "Gadget speed weapon", 88, 91, 88, 86],
      ["Steve Hutchinson", "OL", "Hall of Fame guard", 98, 99, 95, 95],
      ["Visanthe Shiancoe", "TE", "Red-zone tight end", 83, 85, 79, 87]
    ]
  },
  {
    team: "Detroit Lions",
    decade: "2020s",
    cards: [
      ["Jared Goff", "QB", "Rhythm playoff passer", 91, 93, 88, 94],
      ["Jahmyr Gibbs", "RB", "Explosive space back", 91, 94, 91, 90],
      ["Amon-Ra St. Brown", "WR", "Slot alpha receiver", 96, 98, 95, 95],
      ["Jameson Williams", "WR", "Field-tilting speed", 86, 90, 86, 84],
      ["Penei Sewell", "OL", "Elite tone-setting tackle", 98, 99, 95, 96],
      ["Sam LaPorta", "TE", "Instant-impact tight end", 91, 93, 88, 91]
    ]
  },
  {
    team: "Las Vegas Raiders",
    decade: "1980s",
    cards: [
      ["Jim Plunkett", "QB", "Two-time champion passer", 88, 90, 88, 92],
      ["Marcus Allen", "RB", "MVP do-it-all back", 98, 99, 98, 95],
      ["Tim Brown", "WR", "Young Hall of Fame spark", 90, 93, 89, 88],
      ["Todd Christensen", "TE", "All-Pro receiving TE", 94, 96, 92, 93],
      ["Don Mosebar", "OL", "Pro Bowl center", 90, 92, 86, 91],
      ["Bo Jackson", "FLEX", "Mythic power-speed wildcard", 94, 97, 98, 84]
    ]
  },
  {
    team: "Denver Broncos",
    decade: "2010s",
    cards: [
      ["Peyton Manning", "QB", "Record-setting MVP commander", 99, 100, 100, 96],
      ["C.J. Anderson", "RB", "Playoff power runner", 86, 88, 84, 90],
      ["Demaryius Thomas", "WR", "YAC boundary star", 94, 96, 93, 92],
      ["Emmanuel Sanders", "WR", "Precise vertical WR2", 90, 92, 88, 92],
      ["Ryan Clady", "OL", "All-Pro left tackle", 94, 96, 91, 92],
      ["Julius Thomas", "TE", "Touchdown tight end", 88, 91, 86, 87]
    ]
  },
  {
    team: "New York Giants",
    decade: "2000s",
    cards: [
      ["Eli Manning", "QB", "Two-ring playoff passer", 91, 92, 92, 94],
      ["Tiki Barber", "RB", "All-purpose rushing star", 93, 95, 91, 90],
      ["Plaxico Burress", "WR", "Title-game jump-ball target", 89, 91, 87, 90],
      ["Amani Toomer", "WR", "Reliable franchise receiver", 87, 89, 83, 91],
      ["Chris Snee", "OL", "Pro Bowl mauler", 91, 93, 87, 93],
      ["Jeremy Shockey", "TE", "Fiery receiving TE", 88, 90, 86, 88]
    ]
  },
  {
    team: "Philadelphia Eagles",
    decade: "2010s",
    cards: [
      ["Nick Foles", "QB", "Super Bowl run flamethrower", 88, 91, 90, 92],
      ["LeSean McCoy", "RB", "Cutback rushing artist", 96, 98, 95, 89],
      ["DeSean Jackson", "WR", "Deep-ball nightmare", 92, 95, 92, 87],
      ["Alshon Jeffery", "WR", "Playoff possession target", 88, 90, 86, 90],
      ["Jason Peters", "OL", "Hall-level left tackle", 98, 99, 95, 95],
      ["Zach Ertz", "TE", "Record-catch tight end", 94, 96, 92, 94]
    ]
  },
  {
    team: "Washington Commanders",
    decade: "2010s",
    cards: [
      ["Kirk Cousins", "QB", "Efficient rhythm passer", 88, 90, 85, 88],
      ["Alfred Morris", "RB", "Zone-run workhorse", 88, 90, 84, 90],
      ["DeSean Jackson", "WR", "Vertical lid-lifter", 90, 93, 90, 86],
      ["Pierre Garcon", "WR", "Tough chain mover", 87, 89, 83, 90],
      ["Trent Williams", "OL", "Elite left tackle", 99, 100, 96, 94],
      ["Jordan Reed", "TE", "Route-running mismatch", 91, 94, 89, 86]
    ]
  },
  {
    team: "Seattle Seahawks",
    decade: "2000s",
    cards: [
      ["Matt Hasselbeck", "QB", "West Coast Pro Bowler", 89, 91, 86, 91],
      ["Shaun Alexander", "RB", "MVP touchdown machine", 96, 98, 96, 92],
      ["Darrell Jackson", "WR", "Reliable WR1", 86, 88, 82, 89],
      ["Bobby Engram", "WR", "Slot chain mover", 84, 86, 80, 90],
      ["Walter Jones", "OL", "All-time left tackle", 100, 100, 98, 96],
      ["Jerramy Stevens", "TE", "Red-zone target", 82, 84, 78, 86]
    ]
  },
  {
    team: "Arizona Cardinals",
    decade: "2010s",
    cards: [
      ["Carson Palmer", "QB", "Deep-shot MVP candidate", 91, 94, 89, 90],
      ["David Johnson", "RB", "1,000/800 weapon", 94, 97, 93, 88],
      ["Larry Fitzgerald", "WR", "Late-prime slot legend", 95, 97, 95, 96],
      ["Michael Floyd", "WR", "Big-play boundary WR", 84, 87, 82, 85],
      ["D.J. Humphries", "OL", "Steady left tackle", 86, 88, 82, 87],
      ["John Brown", "FLEX", "Vertical speed spark", 84, 87, 83, 85]
    ]
  },
  {
    team: "Tampa Bay Buccaneers",
    decade: "2000s",
    cards: [
      ["Brad Johnson", "QB", "Efficient title passer", 86, 88, 84, 93],
      ["Warrick Dunn", "RB", "Explosive all-purpose back", 89, 92, 86, 90],
      ["Keyshawn Johnson", "WR", "Physical possession WR", 88, 90, 86, 90],
      ["Joey Galloway", "WR", "Speed veteran target", 87, 90, 84, 87],
      ["Jeff Christy", "OL", "Pro Bowl center", 88, 90, 84, 91],
      ["Mike Alstott", "FLEX", "Power fullback icon", 89, 91, 88, 94]
    ]
  },
  {
    team: "New Orleans Saints",
    decade: "2010s",
    cards: [
      ["Drew Brees", "QB", "Precision volume master", 99, 100, 99, 98],
      ["Alvin Kamara", "RB", "Space-scoring weapon", 96, 99, 96, 94],
      ["Michael Thomas", "WR", "Catch-record receiver", 97, 99, 96, 95],
      ["Brandin Cooks", "WR", "Vertical separator", 89, 92, 88, 88],
      ["Terron Armstead", "OL", "Elite left tackle", 95, 97, 92, 94],
      ["Jimmy Graham", "TE", "Red-zone mismatch", 96, 98, 96, 92]
    ]
  },
  {
    team: "Atlanta Falcons",
    decade: "2000s",
    cards: [
      ["Michael Vick", "QB", "Electric rushing QB", 96, 97, 99, 85],
      ["Warrick Dunn", "RB", "Explosive outside runner", 89, 92, 86, 89],
      ["Roddy White", "WR", "Emerging franchise WR", 90, 92, 88, 90],
      ["Peerless Price", "WR", "Speed complement", 82, 84, 79, 84],
      ["Todd McClure", "OL", "Long-time line anchor", 87, 89, 83, 91],
      ["Alge Crumpler", "TE", "Pro Bowl tight end", 91, 93, 88, 90]
    ]
  },
  {
    team: "Carolina Panthers",
    decade: "2000s",
    cards: [
      ["Jake Delhomme", "QB", "Super Bowl run passer", 87, 89, 84, 91],
      ["DeAngelo Williams", "RB", "Big-play rushing star", 91, 94, 89, 88],
      ["Steve Smith Sr.", "WR", "Triple-crown firestarter", 98, 99, 98, 91],
      ["Muhsin Muhammad", "WR", "Physical scoring WR", 90, 92, 87, 91],
      ["Jordan Gross", "OL", "Pro Bowl left tackle", 92, 94, 88, 92],
      ["Wesley Walls", "TE", "Veteran receiving TE", 86, 88, 83, 88]
    ]
  },
  {
    team: "Cincinnati Bengals",
    decade: "2000s",
    cards: [
      ["Carson Palmer", "QB", "Big-arm Pro Bowl passer", 91, 93, 89, 87],
      ["Rudi Johnson", "RB", "Volume power back", 87, 89, 83, 88],
      ["Chad Johnson", "WR", "Route-showman superstar", 96, 98, 96, 88],
      ["T.J. Houshmandzadeh", "WR", "Possession WR2", 89, 91, 85, 90],
      ["Willie Anderson", "OL", "Elite right tackle", 96, 98, 92, 91],
      ["Chris Henry", "FLEX", "Vertical scoring threat", 83, 86, 82, 82]
    ]
  },
  {
    team: "Cleveland Browns",
    decade: "1980s",
    cards: [
      ["Bernie Kosar", "QB", "Playoff rhythm passer", 90, 92, 88, 92],
      ["Kevin Mack", "RB", "Power running back", 87, 89, 84, 90],
      ["Webster Slaughter", "WR", "Explosive outside WR", 88, 91, 85, 88],
      ["Ozzie Newsome", "TE", "Hall of Fame tight end", 96, 98, 94, 95],
      ["Mike Baab", "OL", "Pro Bowl center", 87, 89, 83, 90],
      ["Earnest Byner", "FLEX", "All-purpose back", 88, 90, 85, 91]
    ]
  },
  {
    team: "New York Jets",
    decade: "2000s",
    cards: [
      ["Chad Pennington", "QB", "Accurate timing passer", 87, 89, 83, 91],
      ["Curtis Martin", "RB", "Rushing-title workhorse", 96, 97, 94, 94],
      ["Laveranues Coles", "WR", "Tough separator", 88, 90, 84, 89],
      ["Santonio Holmes", "WR", "Clutch playoff target", 86, 88, 84, 88],
      ["Nick Mangold", "OL", "All-Pro center", 96, 98, 92, 94],
      ["Dustin Keller", "TE", "Receiving tight end", 84, 86, 80, 87]
    ]
  },
  {
    team: "Los Angeles Chargers",
    decade: "2010s",
    cards: [
      ["Philip Rivers", "QB", "Veteran volume passer", 92, 94, 89, 90],
      ["Melvin Gordon", "RB", "Touchdown workhorse", 88, 91, 86, 88],
      ["Keenan Allen", "WR", "Route-running technician", 95, 97, 94, 92],
      ["Mike Williams", "WR", "Contested-catch threat", 87, 90, 85, 86],
      ["Russell Okung", "OL", "Veteran blindside tackle", 88, 90, 84, 88],
      ["Antonio Gates", "TE", "Late-prime red-zone TE", 91, 93, 90, 91]
    ]
  },
  {
    team: "Tennessee Titans",
    decade: "2000s",
    cards: [
      ["Vince Young", "QB", "Rookie-year playmaker", 86, 88, 88, 84],
      ["Chris Johnson", "RB", "2,000-yard speed demon", 98, 100, 98, 87],
      ["Derrick Mason", "WR", "Early-decade separator", 88, 90, 84, 91],
      ["Kenny Britt", "WR", "Big-play target", 83, 86, 82, 82],
      ["Michael Roos", "OL", "All-Pro left tackle", 92, 94, 88, 91],
      ["Bo Scaife", "TE", "Move tight end", 82, 84, 78, 86]
    ]
  },
  {
    team: "Houston Texans",
    decade: "2000s",
    cards: [
      ["Matt Schaub", "QB", "Play-action volume passer", 87, 90, 84, 88],
      ["Domanick Williams", "RB", "Early franchise back", 84, 87, 80, 85],
      ["Andre Johnson", "WR", "Prime physical WR1", 97, 99, 96, 90],
      ["Kevin Walter", "WR", "Steady possession WR", 83, 85, 79, 87],
      ["Eric Winston", "OL", "Reliable right tackle", 86, 88, 82, 88],
      ["Owen Daniels", "TE", "Pro Bowl tight end", 87, 89, 83, 89]
    ]
  },
  {
    team: "Jacksonville Jaguars",
    decade: "2000s",
    cards: [
      ["David Garrard", "QB", "Efficient playoff passer", 86, 89, 84, 88],
      ["Maurice Jones-Drew", "RB", "Compact scoring engine", 95, 97, 94, 90],
      ["Jimmy Smith", "WR", "Early-decade route star", 91, 93, 88, 91],
      ["Keenan McCardell", "WR", "Veteran chain mover", 86, 88, 82, 89],
      ["Brad Meester", "OL", "Long-time center", 86, 88, 82, 90],
      ["Marcedes Lewis", "TE", "Complete tight end", 86, 88, 82, 89]
    ]
  }
];

const expandedSpinDeck: Spin[] = expandedRosterSeeds.map(({ team, decade }) => ({ team, decade }));
const spinDeck: Spin[] = [...baseSpinDeck, ...expandedSpinDeck];
const expandedOffensePlayers: Player[] = expandedRosterSeeds.flatMap(({ team, decade, cards }) =>
  cards.map(([name, position, stats, rating, offense, star, chemistry]) => ({
    id: `${team}-${decade}-${name}`.toLowerCase().replaceAll(" ", "-").replaceAll(".", "").replaceAll("'", ""),
    name,
    team,
    decade,
    position,
    stats,
    rating,
    offense,
    defense: position === "OL" ? 34 : position === "TE" || position === "FLEX" ? 38 : 30,
    star,
    chemistry
  }))
);

const journeymanPlayers: Player[] = [
  { id: "josh-johnson-bucs-2000s", name: "Josh Johnson", team: "Tampa Bay Buccaneers", decade: "2000s", position: "QB", stats: "Athletic developmental QB", rating: 74, offense: 78, defense: 28, star: 70, chemistry: 78 },
  { id: "josh-johnson-washington-2010s", name: "Josh Johnson", team: "Washington Commanders", decade: "2010s", position: "QB", stats: "Late-season dual-threat spark", rating: 76, offense: 80, defense: 28, star: 72, chemistry: 82 },
  { id: "josh-johnson-ravens-2010s", name: "Josh Johnson", team: "Baltimore Ravens", decade: "2010s", position: "QB", stats: "Emergency mobile passer", rating: 73, offense: 77, defense: 28, star: 69, chemistry: 80 },
  { id: "ryan-fitzpatrick-texans-2010s", name: "Ryan Fitzpatrick", team: "Houston Texans", decade: "2010s", position: "QB", stats: "Fearless gunslinger cameo", rating: 82, offense: 85, defense: 28, star: 82, chemistry: 80 },
  { id: "josh-mccown-cardinals-2000s", name: "Josh McCown", team: "Arizona Cardinals", decade: "2000s", position: "QB", stats: "Young scramble-pass starter", rating: 77, offense: 80, defense: 28, star: 73, chemistry: 79 },
  { id: "teddy-bridgewater-saints-2010s", name: "Teddy Bridgewater", team: "New Orleans Saints", decade: "2010s", position: "QB", stats: "Efficient spot-start winner", rating: 84, offense: 86, defense: 28, star: 80, chemistry: 90 },
  { id: "geno-smith-seahawks-2010s", name: "Geno Smith", team: "Seattle Seahawks", decade: "2010s", position: "QB", stats: "Backup reset before breakout", rating: 76, offense: 79, defense: 28, star: 72, chemistry: 82 },
  { id: "michael-vick-eagles-2000s", name: "Michael Vick", team: "Philadelphia Eagles", decade: "2000s", position: "QB", stats: "Explosive late-decade reset", rating: 83, offense: 87, defense: 28, star: 90, chemistry: 76 },
  { id: "taysom-hill-saints-2010s", name: "Taysom Hill", team: "New Orleans Saints", decade: "2010s", position: "FLEX", stats: "QB/RB/TE gadget weapon", rating: 86, offense: 89, defense: 42, star: 84, chemistry: 91 },
  { id: "tyrod-taylor-ravens-2010s", name: "Tyrod Taylor", team: "Baltimore Ravens", decade: "2010s", position: "QB", stats: "Mobile backup with playoff legs", rating: 78, offense: 82, defense: 28, star: 76, chemistry: 84 }
];

const defenseRatings: Record<string, Pick<Player, "rating" | "offense" | "defense" | "star" | "chemistry" | "stats">> = {
  "Dallas Cowboys-1990s": { rating: 93, offense: 35, defense: 95, star: 92, chemistry: 95, stats: "Fast, physical championship defense" },
  "San Francisco 49ers-1980s": { rating: 92, offense: 34, defense: 94, star: 91, chemistry: 96, stats: "Balanced title-era unit" },
  "New England Patriots-2000s": { rating: 94, offense: 33, defense: 96, star: 92, chemistry: 99, stats: "Belichick-era matchup defense" },
  "Pittsburgh Steelers-1970s": { rating: 100, offense: 30, defense: 100, star: 100, chemistry: 99, stats: "Steel Curtain, all-time force" },
  "Green Bay Packers-1960s": { rating: 95, offense: 32, defense: 97, star: 93, chemistry: 99, stats: "Lombardi-era title defense" },
  "Chicago Bears-1980s": { rating: 100, offense: 30, defense: 100, star: 100, chemistry: 98, stats: "46 Defense, chaos machine" },
  "Baltimore Ravens-2000s": { rating: 100, offense: 30, defense: 100, star: 100, chemistry: 97, stats: "Historic physical defense" },
  "Indianapolis Colts-2000s": { rating: 89, offense: 36, defense: 91, star: 87, chemistry: 92, stats: "Speed rush dome defense" },
  "Miami Dolphins-1970s": { rating: 94, offense: 32, defense: 96, star: 91, chemistry: 99, stats: "No-Name Defense, perfect-season fit" },
  "Minnesota Vikings-1990s": { rating: 90, offense: 34, defense: 92, star: 89, chemistry: 90, stats: "Explosive front with turnover punch" },
  "Los Angeles Rams-2010s": { rating: 95, offense: 34, defense: 97, star: 96, chemistry: 92, stats: "Aaron Donald-led pressure unit" },
  "Kansas City Chiefs-2020s": { rating: 94, offense: 35, defense: 96, star: 94, chemistry: 96, stats: "Modern pressure and coverage unit" },
  "Detroit Lions-1990s": { rating: 84, offense: 34, defense: 86, star: 82, chemistry: 86, stats: "Scrappy NFC Central defense" },
  "Las Vegas Raiders-1970s": { rating: 93, offense: 33, defense: 95, star: 92, chemistry: 95, stats: "Hard-hitting title-era defense" }
};

const offensePlayers = [...players, ...offenseRosterAddons, ...expandedOffensePlayers, ...journeymanPlayers].filter((player) => offensePositions.includes(player.position));

function slugify(value: string) {
  return value.toLowerCase().replaceAll(" ", "-");
}

function randomFrom<T>(items: T[]) {
  return items[Math.floor(Math.random() * items.length)];
}

function trackGameEvent(event: string, data?: Record<string, string | number | boolean>) {
  try {
    track(event, data);
  } catch {
    // Analytics should never get in the way of the game.
  }
}

function getDefenseProfile(team: string, decade: string) {
  const exact = defenseRatings[`${team}-${decade}`];
  if (exact) return exact;

  const teamProfile = spinDeck
    .filter((spin) => spin.team === team)
    .map((spin) => defenseRatings[`${spin.team}-${spin.decade}`])
    .find(Boolean);

  const decadeProfile = spinDeck
    .filter((spin) => spin.decade === decade)
    .map((spin) => defenseRatings[`${spin.team}-${spin.decade}`])
    .find(Boolean);

  const base = teamProfile || decadeProfile || { rating: 88, offense: 34, defense: 90, star: 86, chemistry: 88, stats: "Fantasy-style team defense" };
  const oldEraBonus = decade === "1960s" || decade === "1970s" ? 2 : 0;
  const modernBonus = decade === "2000s" || decade === "2020s" ? 1 : 0;

  return {
    rating: Math.min(99, Math.max(80, base.rating - 3 + oldEraBonus + modernBonus)),
    offense: base.offense,
    defense: Math.min(99, Math.max(82, base.defense - 3 + oldEraBonus + modernBonus)),
    star: Math.min(99, Math.max(80, base.star - 3 + oldEraBonus)),
    chemistry: Math.min(99, Math.max(82, base.chemistry - 2 + oldEraBonus)),
    stats: `${decade} fantasy team defense`
  };
}

function getTeamDefense(spin: Spin): Player {
  const rating = getDefenseProfile(spin.team, spin.decade);

  return {
    id: `${slugify(spin.team)}-${spin.decade}-def`,
    name: `${spin.team} Defense`,
    team: spin.team,
    decade: spin.decade,
    position: "DEF",
    ...rating
  };
}

const teamDefenses: Player[] = spinDeck.map(getTeamDefense);
const draftPool = [...offensePlayers, ...teamDefenses];

const exampleRoster: Player[] = ["montana", "barry", "rice", "moss-vikes", "kelce", "art-shell", "payton", "baltimore-ravens-2000s-def"]
  .map((id) => [...players, ...teamDefenses].find((player) => player.id === id))
  .filter(Boolean) as Player[];

const positionCopy: Record<Position, string> = {
  QB: "Field general",
  RB: "Backfield engine",
  WR: "Boundary weapon",
  TE: "Mismatch maker",
  OL: "Pocket security",
  DL: "Trench disruptor",
  LB: "Second-level captain",
  CB: "Lockdown edge",
  S: "Deep eraser",
  FLEX: "Wildcard star",
  DEF: "Fantasy defense"
};

function getScore(roster: (Player | null)[]) {
  const filled = roster.filter(Boolean) as Player[];
  if (!filled.length) {
    return { overall: 0, offense: 0, defense: 0, star: 0, balance: 0, chemistry: 0, wins: 0, losses: 17 };
  }

  const avg = (key: keyof Pick<Player, "rating" | "offense" | "star" | "chemistry">) =>
    filled.reduce((sum, player) => sum + player[key], 0) / filled.length;
  const offensiveFilled = filled.filter((player) => player.position !== "DEF");
  const defenseFilled = filled.filter((player) => player.position === "DEF");
  const offense = offensiveFilled.length
    ? offensiveFilled.reduce((sum, player) => sum + player.offense, 0) / offensiveFilled.length
    : avg("offense");
  const defense = defenseFilled.length
    ? defenseFilled.reduce((sum, player) => sum + player.defense, 0) / defenseFilled.length
    : 70;
  const star = avg("star");
  const chemistry = avg("chemistry");
  const filledSlots = filled.length / rosterSlots.length;
  const positionSpread = new Set(filled.map((player) => player.position)).size / 7;
  const eraBonus = new Set(filled.map((player) => `${player.team}-${player.decade}`)).size >= 5 ? 6 : 2;
  const balance = Math.min(100, Math.round(58 + positionSpread * 26 + filledSlots * 10 + eraBonus));
  const averageRating = avg("rating");
  const overall = averageRating * 0.3 + offense * 0.22 + defense * 0.14 + star * 0.14 + balance * 0.11 + chemistry * 0.09;
  const completeBonus = filled.length === rosterSlots.length ? 3 : 0;
  const rawWins = Math.round((overall + completeBonus - 70) / 2.25);
  let wins = Math.max(0, Math.min(14, rawWins));

  if (
    filled.length === rosterSlots.length &&
    overall >= 97.8 &&
    averageRating >= 96.8 &&
    offense >= 97.5 &&
    defense >= 95 &&
    star >= 96.8 &&
    balance >= 95 &&
    chemistry >= 94.5
  ) {
    wins = 17;
  } else if (
    overall >= 96.8 &&
    averageRating >= 95.8 &&
    offense >= 96.8 &&
    defense >= 93 &&
    star >= 95.8 &&
    balance >= 94 &&
    chemistry >= 93.5
  ) {
    wins = 16;
  } else if (overall >= 95 && offense >= 96 && defense >= 90 && star >= 94 && balance >= 92 && chemistry >= 92) {
    wins = Math.max(wins, 15);
  } else if (overall >= 94 && offense >= 95 && defense >= 89 && star >= 93 && balance >= 91 && chemistry >= 91) {
    wins = Math.max(wins, 14);
  }

  return {
    overall: Math.round(overall),
    offense: Math.round(offense),
    defense: Math.round(defense),
    star: Math.round(star),
    balance: Math.round(balance),
    chemistry: Math.round(chemistry),
    wins,
    losses: 17 - wins
  };
}

function canFill(slot: Position, player: Player) {
  return (slot === "FLEX" && player.position !== "DEF" && player.position !== "QB") || slot === player.position;
}

function ratingTone(rating: number) {
  if (rating >= 98) return "legendary";
  if (rating >= 94) return "elite";
  if (rating >= 90) return "prime";
  return "solid";
}

function clampStat(value: number, min: number, max: number) {
  return Math.max(min, Math.min(max, Math.round(value)));
}

function getPlayerMetrics(player: Player) {
  if (player.position === "QB") {
    return [
      { label: "Comp", value: `${clampStat(53 + (player.offense - 80) * 0.52 + (player.chemistry - 85) * 0.12, 55, 72)}%` },
      { label: "TD", value: `${clampStat(18 + (player.star - 80) * 0.95, 18, 50)}` }
    ];
  }

  if (player.position === "RB") {
    return [
      { label: "Rush", value: `${clampStat(850 + (player.offense - 82) * 34, 650, 1700)}` },
      { label: "TD", value: `${clampStat(6 + (player.star - 82) * 0.45, 5, 20)}` }
    ];
  }

  if (player.position === "WR") {
    return [
      { label: "Rec Yds", value: `${clampStat(780 + (player.offense - 82) * 28, 550, 1600)}` },
      { label: "TD", value: `${clampStat(5 + (player.star - 82) * 0.38, 4, 18)}` }
    ];
  }

  if (player.position === "TE") {
    return [
      { label: "Rec Yds", value: `${clampStat(520 + (player.offense - 80) * 20, 350, 1150)}` },
      { label: "TD", value: `${clampStat(4 + (player.star - 80) * 0.32, 3, 15)}` }
    ];
  }

  if (player.position === "OL") {
    return [
      { label: "Pass Blk", value: `${clampStat(player.offense - 1, 75, 99)}` },
      { label: "Run Blk", value: `${clampStat(player.offense, 75, 99)}` }
    ];
  }

  if (player.position === "DEF") {
    return [
      { label: "PA/G", value: `${clampStat(24 - (player.defense - 84) * 0.34, 14, 24)}` },
      { label: "Takeaways", value: `${clampStat(18 + (player.star - 82) * 0.55, 16, 34)}` }
    ];
  }

  return [
    { label: "Scrim", value: `${clampStat(700 + (player.offense - 80) * 24, 450, 1400)}` },
    { label: "TD", value: `${clampStat(4 + (player.star - 80) * 0.32, 3, 16)}` }
  ];
}

export default function Home() {
  const [screen, setScreen] = useState<Screen>("home");
  const [currentSpin, setCurrentSpin] = useState<Spin | null>(null);
  const [isSpinning, setIsSpinning] = useState(false);
  const [drafted, setDrafted] = useState<Player[]>([]);
  const [roster, setRoster] = useState<(Player | null)[]>(Array(rosterSlots.length).fill(null));
  const [saved, setSaved] = useState(false);
  const [showProjection, setShowProjection] = useState(false);
  const [teamRefreshUsed, setTeamRefreshUsed] = useState(false);
  const [decadeRefreshUsed, setDecadeRefreshUsed] = useState(false);
  const [rolledTeams, setRolledTeams] = useState<string[]>([]);
  const [resultsUnlocked, setResultsUnlocked] = useState(false);
  const [shareStatus, setShareStatus] = useState<"idle" | "shared" | "copied" | "failed">("idle");

  const round = Math.min(drafted.length + 1, rosterSlots.length);
  const score = useMemo(() => getScore(roster), [roster]);
  const isRosterComplete = roster.every(Boolean);
  const hasOpenSlot = (player: Player) => roster.some((slotPlayer, index) => !slotPlayer && canFill(rosterSlots[index], player));
  const isUndrafted = (player: Player) => !drafted.some((draftedPlayer) => draftedPlayer.id === player.id);
  const getSpinOptions = (spin: Spin) => [
    ...offensePlayers.filter((player) => player.team === spin.team && player.decade === spin.decade),
    getTeamDefense(spin)
  ];
  const spinHasDraftableOption = (spin: Spin) => getSpinOptions(spin).some((player) => isUndrafted(player) && hasOpenSlot(player));
  const viableSpinDeck = spinDeck.filter(spinHasDraftableOption);
  const unusedSpinDeck = viableSpinDeck.filter((spin) => !rolledTeams.includes(spin.team));
  const spinChoices = unusedSpinDeck.length ? unusedSpinDeck : viableSpinDeck;
  const availablePlayers = currentSpin
    ? getSpinOptions(currentSpin).filter(isUndrafted)
    : [];
  const teamRefreshOptions = currentSpin
    ? spinDeck.filter((spin) => spin.decade === currentSpin.decade && spin.team !== currentSpin.team && !rolledTeams.includes(spin.team) && spinHasDraftableOption(spin))
    : [];
  const decadeRefreshOptions = currentSpin
    ? spinDeck.filter((spin) => spin.team === currentSpin.team && spin.decade !== currentSpin.decade && spinHasDraftableOption(spin))
    : [];

  function resetGame(useExample = false, source = "button") {
    const nextRoster = Array(rosterSlots.length).fill(null) as (Player | null)[];
    const nextDrafted = useExample ? [...exampleRoster] : [];

    if (useExample) {
      nextDrafted.forEach((player) => {
        const index = nextRoster.findIndex((slotPlayer, slotIndex) => !slotPlayer && canFill(rosterSlots[slotIndex], player));
        if (index >= 0) nextRoster[index] = player;
      });
    }

    setCurrentSpin(null);
    setIsSpinning(false);
    setDrafted(nextDrafted);
    setRoster(nextRoster);
    setSaved(false);
    setShowProjection(false);
    setTeamRefreshUsed(false);
    setDecadeRefreshUsed(false);
    setRolledTeams([]);
    setResultsUnlocked(false);
    setShareStatus("idle");
    setScreen(useExample ? "rating" : "draft");
    trackGameEvent(useExample ? "Example Team Viewed" : "Draft Started", { source });
  }

  function revealSpin(spin: Spin) {
    setCurrentSpin(spin);
    setRolledTeams((teams) => (teams.includes(spin.team) ? teams : [...teams, spin.team]));
  }

  function spinTeam() {
    if (!spinChoices.length) return;
    setIsSpinning(true);
    window.setTimeout(() => {
      const nextSpin = randomFrom(spinChoices);
      revealSpin(nextSpin);
      setIsSpinning(false);
      trackGameEvent("Team Decade Spun", {
        team: nextSpin.team,
        decade: nextSpin.decade,
        round,
        remaining_slots: rosterSlots.length - drafted.length
      });
    }, 680);
  }

  function refreshTeam() {
    if (!currentSpin || teamRefreshUsed || drafted.length >= rosterSlots.length) return;
    if (!teamRefreshOptions.length) return;
    const nextSpin = randomFrom(teamRefreshOptions);
    revealSpin(nextSpin);
    setTeamRefreshUsed(true);
    trackGameEvent("Team Refreshed", {
      from_team: currentSpin.team,
      to_team: nextSpin.team,
      decade: nextSpin.decade,
      round
    });
  }

  function refreshDecade() {
    if (!currentSpin || decadeRefreshUsed || drafted.length >= rosterSlots.length) return;
    if (!decadeRefreshOptions.length) return;
    const nextSpin = randomFrom(decadeRefreshOptions);
    revealSpin(nextSpin);
    setDecadeRefreshUsed(true);
    trackGameEvent("Decade Refreshed", {
      team: nextSpin.team,
      from_decade: currentSpin.decade,
      to_decade: nextSpin.decade,
      round
    });
  }

  function draftPlayer(player: Player) {
    if (drafted.length >= rosterSlots.length || drafted.some((draftedPlayer) => draftedPlayer.id === player.id)) return;
    const openIndex = roster.findIndex((slotPlayer, index) => !slotPlayer && canFill(rosterSlots[index], player));
    if (openIndex < 0) return;
    const nextDraftedCount = drafted.length + 1;
    const nextRoster = roster.map((slotPlayer, index) => (index === openIndex ? player : slotPlayer));
    const nextScore = getScore(nextRoster);
    setDrafted((items) => [...items, player]);
    if (openIndex >= 0) {
      setRoster((items) => items.map((slotPlayer, index) => (index === openIndex ? player : slotPlayer)));
    }
    setCurrentSpin(null);
    trackGameEvent("Player Drafted", {
      team: player.team,
      decade: player.decade,
      position: player.position,
      slot: rosterSlots[openIndex],
      round: nextDraftedCount
    });
    if (nextDraftedCount >= rosterSlots.length) {
      trackGameEvent("Draft Completed", {
        record: `${nextScore.wins}-${nextScore.losses}`,
        perfect: nextScore.wins === 17
      });
      if (nextScore.wins === 17) {
        trackGameEvent("Perfect Season Earned");
      }
      setScreen("rating");
    }
  }

  function goToResults() {
    if (!resultsUnlocked) {
      trackGameEvent("Final Results Viewed", {
        wins: score.wins,
        losses: score.losses,
        perfect: score.wins === 17,
        overall_score: score.overall
      });
    }
    setResultsUnlocked(true);
    setScreen("results");
  }

  async function shareTeam() {
    const shareUrl = "https://17-0.io";
    const rosterText = rosterSlots
      .map((slot, index) => {
        const player = roster[index];
        return `${slot}: ${player ? `${player.name} (${player.team}, ${player.decade})` : "Empty"}`;
      })
      .join("\n");
    const text = `My 17-0 draft team went ${score.wins}-${score.losses}.\nCan you beat it?\n\n${rosterText}\n\nPlay 17-0:\n17-0.io`;

    try {
      if (navigator.share) {
        await navigator.share({
          title: `My 17-0 team went ${score.wins}-${score.losses}`,
          text,
          url: shareUrl
        });
        setShareStatus("shared");
        window.setTimeout(() => setShareStatus("idle"), 1800);
        trackGameEvent("Lineup Shared", {
          method: "native_share",
          wins: score.wins,
          losses: score.losses,
          perfect: score.wins === 17
        });
        return;
      }

      await navigator.clipboard?.writeText(text);
      setShareStatus("copied");
      window.setTimeout(() => setShareStatus("idle"), 1800);
      trackGameEvent("Lineup Shared", {
        method: "clipboard",
        wins: score.wins,
        losses: score.losses,
        perfect: score.wins === 17
      });
    } catch {
      if (navigator.clipboard) {
        await navigator.clipboard.writeText(text);
        setShareStatus("copied");
        window.setTimeout(() => setShareStatus("idle"), 1800);
        trackGameEvent("Lineup Shared", {
          method: "clipboard_fallback",
          wins: score.wins,
          losses: score.losses,
          perfect: score.wins === 17
        });
      } else {
        setShareStatus("failed");
        window.setTimeout(() => setShareStatus("idle"), 2200);
      }
    }
  }

  const shareLabel = shareStatus === "shared" ? "Shared" : shareStatus === "copied" ? "Copied Challenge" : shareStatus === "failed" ? "Share Unavailable" : "Share Challenge";

  function saveTeam() {
    setSaved(true);
    if (!saved) {
      trackGameEvent("Team Saved", {
        wins: score.wins,
        losses: score.losses,
        perfect: score.wins === 17
      });
    }
  }

  function viewLineupFromResults() {
    trackGameEvent("Final Lineup Viewed", {
      wins: score.wins,
      losses: score.losses,
      perfect: score.wins === 17
    });
    setScreen("draft");
  }

  const navItems: { key: Screen; label: string }[] = [
    { key: "draft", label: "Draft" },
    { key: "rating", label: "Ratings" },
    { key: "system", label: "Design System" }
  ];

  return (
    <main className="app-shell">
      <div className="stadium-glow" />
      <header className="topbar">
        <button className="brand-mark" onClick={() => setScreen("home")} aria-label="Go home">
          <span>17</span><span>-0</span>
        </button>
        <nav className="step-nav" aria-label="Game sections">
          {navItems.map((item) => (
            <button key={item.key} className={screen === item.key ? "active" : ""} onClick={() => setScreen(item.key)}>
              {item.label}
            </button>
          ))}
        </nav>
        <button className="small-action" onClick={() => resetGame(false, "topbar")}>New Draft</button>
      </header>

      {screen === "home" && (
        <section className="hero screen-fade">
          <div className="yard-lines" />
          <div className="hero-content">
            <p className="eyebrow">NFL all-time draft game</p>
            <h1>17-0</h1>
            <p className="hero-copy">Build the ultimate NFL all-time team and see if you can go undefeated.</p>
            <div className="hero-actions">
              <button className="primary-cta" onClick={() => resetGame(false, "home")}>Start Draft</button>
              <button className="secondary-cta" onClick={() => setScreen("how")}>How to Play</button>
              <button className="secondary-cta" onClick={() => resetGame(true, "home")}>View Example Team</button>
            </div>
          </div>
          <div className="hero-scoreboard">
            <span>Target Record</span>
            <strong>17-0</strong>
          </div>
        </section>
      )}

      {screen === "how" && (
        <section className="content-grid screen-fade">
          <div className="section-heading">
            <p className="eyebrow">How to play</p>
            <h2>Spin, draft, assign, reveal.</h2>
          </div>
          <div className="instruction-list">
            {[
              "Spin to get a random NFL team and decade.",
              "Choose one offensive player or that team's fantasy-style defense.",
              "Watch the player drop into the live field lineup.",
              "Fill every offensive spot plus one team defense.",
              "Your team is rated on offense, defense, star power, chemistry, and balance.",
              "Try to finish with a perfect 17-0 record."
            ].map((item, index) => (
              <article className="instruction-card" key={item}>
                <span>{index + 1}</span>
                <p>{item}</p>
              </article>
            ))}
          </div>
          <button className="primary-cta inline" onClick={() => resetGame(false, "how_to_play")}>Start Draft</button>
        </section>
      )}

      {screen === "draft" && (
        <section className="draft-layout screen-fade">
          <div className="draft-main">
            <div className="section-heading compact">
              <p className="eyebrow">Draft night</p>
              <h2>Round {round} of {rosterSlots.length}</h2>
              <p className="muted">Spin the deck, draft one player or team defense, and watch your lineup fill in live.</p>
            </div>

            <div className={`spin-card ${isSpinning ? "spinning" : ""}`}>
              <div>
                <span className="card-kicker">Team + decade</span>
                <div className="spin-result">
                  <div className="spin-result-box">
                    <span>Team</span>
                    <strong>{isSpinning ? "Rolling..." : currentSpin ? currentSpin.team : "Ready"}</strong>
                  </div>
                  <div className="spin-result-box">
                    <span>Decade</span>
                    <strong>{isSpinning ? "Rolling..." : currentSpin ? currentSpin.decade : "Reveal"}</strong>
                  </div>
                </div>
              </div>
              <div className="spin-actions">
                <button className="primary-cta" onClick={spinTeam} disabled={isSpinning || !!currentSpin || drafted.length >= rosterSlots.length || !spinChoices.length}>
                  {currentSpin ? "Draft From This Roll" : spinChoices.length ? "Spin Team + Decade" : "No Valid Rolls"}
                </button>
                <div className="reroll-actions">
                  <button className="secondary-cta" onClick={refreshTeam} disabled={!currentSpin || teamRefreshUsed || !teamRefreshOptions.length || isSpinning || drafted.length >= rosterSlots.length}>
                    {teamRefreshUsed ? "Team Refresh Used" : teamRefreshOptions.length ? "Refresh Team" : "No Team Refresh"}
                  </button>
                  <button className="secondary-cta" onClick={refreshDecade} disabled={!currentSpin || decadeRefreshUsed || !decadeRefreshOptions.length || isSpinning || drafted.length >= rosterSlots.length}>
                    {decadeRefreshUsed ? "Decade Refresh Used" : decadeRefreshOptions.length ? "Refresh Decade" : "No Decade Refresh"}
                  </button>
                </div>
              </div>
            </div>

            <div className="mobile-war-room">
              <ProgressPanel
                drafted={drafted.length}
                score={score}
                complete={isRosterComplete}
                showProjection={showProjection}
                onToggleProjection={() => setShowProjection((value) => !value)}
                onReveal={() => setScreen(resultsUnlocked ? "results" : "rating")}
                revealLabel={resultsUnlocked ? "Back to Results" : undefined}
              />
              <LiveLineup roster={roster} />
            </div>

            <div className="list-heading">
              <span>{currentSpin ? "Available roster options" : "Player board preview"}</span>
              <strong>{currentSpin ? `${availablePlayers.length} players` : "Spin to unlock"}</strong>
            </div>
            <div className="player-grid">
              {(availablePlayers.length ? availablePlayers : draftPool.slice(0, 8)).map((player) => (
                <PlayerCard
                  key={player.id}
                  player={player}
                  disabled={!currentSpin || drafted.some((draftedPlayer) => draftedPlayer.id === player.id) || drafted.length >= rosterSlots.length || !hasOpenSlot(player)}
                  ghost={!currentSpin}
                  unavailable={!!currentSpin && !hasOpenSlot(player)}
                  onDraft={() => draftPlayer(player)}
                />
              ))}
            </div>
          </div>
          <aside className="draft-sidebar">
            <ProgressPanel
              drafted={drafted.length}
              score={score}
              complete={isRosterComplete}
              showProjection={showProjection}
              onToggleProjection={() => setShowProjection((value) => !value)}
              onReveal={() => setScreen(resultsUnlocked ? "results" : "rating")}
              revealLabel={resultsUnlocked ? "Back to Results" : undefined}
            />
            <LiveLineup roster={roster} />
          </aside>
        </section>
      )}

      {screen === "rating" && (
        <section className="rating-layout screen-fade">
          <div className="record-reveal">
            <p className="eyebrow">Predicted final record</p>
            <strong>{score.wins}-{score.losses}</strong>
            <span>{score.wins === 17 ? "Undefeated profile" : score.wins >= 14 ? "Championship contender" : "Playoff-caliber build"}</span>
            <button className="primary-cta" onClick={goToResults}>Final Reveal</button>
          </div>
          <div className="rating-board">
            <RatingBar label="Overall Team Score" value={score.overall} />
            <RatingBar label="Offensive Score" value={score.offense} />
            <RatingBar label="Defensive Score" value={score.defense} />
            <RatingBar label="Star Power Score" value={score.star} />
            <RatingBar label="Lineup Balance Score" value={score.balance} />
            <RatingBar label="Chemistry / Era Fit Score" value={score.chemistry} />
          </div>
        </section>
      )}

      {screen === "results" && (
        <section className={`results-screen screen-fade ${score.wins === 17 ? "perfect" : ""}`}>
          <div className="confetti" aria-hidden="true" />
          <p className="eyebrow">Final results</p>
          <h2>{score.wins === 17 ? "Perfect Season!" : "Great Team, But Not Perfect"}</h2>
          <strong>{score.wins}-{score.losses}</strong>
          <FinalRoster roster={roster} />
          <div className="trophy" aria-hidden="true" />
          <div className="result-actions">
            <button className="primary-cta" onClick={() => resetGame(false, "results")}>Draft Again</button>
            <button className="secondary-cta" onClick={() => void shareTeam()}>{shareLabel}</button>
            <button className="secondary-cta" onClick={saveTeam}>{saved ? "Team Saved" : "Save Team"}</button>
            <button className="secondary-cta" onClick={viewLineupFromResults}>View Lineup</button>
          </div>
        </section>
      )}

      {screen === "system" && <DesignSystem onStart={() => resetGame(false, "design_system")} />}
    </main>
  );
}

function getInitials(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();
}

function PlayerCard({ player, disabled, ghost, unavailable, onDraft }: { player: Player; disabled: boolean; ghost?: boolean; unavailable?: boolean; onDraft: () => void }) {
  const tone = ghost ? "locked" : ratingTone(player.rating);
  const metrics = getPlayerMetrics(player);

  return (
    <article className={`player-card tone-${tone} ${ghost ? "ghost-card" : ""}`}>
      <div className="card-topline">
        <span>{player.position}</span>
        <span className={`rating-badge ${tone}`}>{ghost ? "LOCK" : player.decade}</span>
      </div>
      <h3>{ghost ? "Spin to unlock" : player.name}</h3>
      <p>{ghost ? "A collectible player card will appear here after the reveal." : `${player.team} / ${player.decade}`}</p>
      {!ghost && (
        <div className="player-metrics">
          {metrics.map((metric) => (
            <span key={metric.label}>
              <small>{metric.label}</small>
              <strong>{metric.value}</strong>
            </span>
          ))}
        </div>
      )}
      <div className="stat-strip">{ghost ? "Era / role / key stats" : player.stats}</div>
      <button className="draft-button" disabled={disabled} onClick={onDraft}>{unavailable ? "Slot Filled" : "Draft Player"}</button>
    </article>
  );
}

function ProgressPanel({
  drafted,
  score,
  complete,
  showProjection,
  onToggleProjection,
  onReveal,
  revealLabel
}: {
  drafted: number;
  score: ReturnType<typeof getScore>;
  complete: boolean;
  showProjection: boolean;
  onToggleProjection: () => void;
  onReveal: () => void;
  revealLabel?: string;
}) {
  return (
    <div className="progress-panel">
      <div className="panel-title">
        <span>War room</span>
        <strong>{drafted}/{rosterSlots.length}</strong>
      </div>
      <div className={`mini-score ${showProjection ? "" : "hidden-score"}`}>
        <span>Live projection</span>
        <strong>{showProjection ? `${score.wins}-${score.losses}` : "--"}</strong>
      </div>
      <button className="secondary-cta full peek-button" onClick={onToggleProjection}>
        {showProjection ? "Hide Projection" : "Peek at Projection"}
      </button>
      <RatingBar label="Roster filled" value={Math.round((drafted / rosterSlots.length) * 100)} />
      <button className="secondary-cta full" disabled={!complete} onClick={onReveal}>{complete ? revealLabel || "Reveal Record" : "Keep Drafting"}</button>
    </div>
  );
}

function LiveLineup({ roster }: { roster: (Player | null)[] }) {
  return (
    <div className="live-lineup-card">
      <div className="panel-title">
        <span>Live lineup</span>
        <strong>{roster.filter(Boolean).length}/{rosterSlots.length}</strong>
      </div>
      <div className="mini-field" aria-label="Fantasy lineup">
        {rosterSlots.map((slot, index) => {
          const player = roster[index];
          return (
            <div
              className={`field-marker ${player ? "filled" : ""} slot-${index}`}
              key={`${slot}-${index}`}
              aria-label={player ? `${slot}: ${player.name}` : `${slot}: empty`}
            >
              <span>{slot}</span>
              <strong>{player ? getInitials(player.name) : "+"}</strong>
              <small>{player ? "Set" : "Open"}</small>
            </div>
          );
        })}
      </div>
      <p className="hint">Picks lock into the first open matching position.</p>
    </div>
  );
}

function FinalRoster({ roster }: { roster: (Player | null)[] }) {
  return (
    <div className="final-roster-card">
      <div className="panel-title">
        <span>Final roster</span>
        <strong>{roster.filter(Boolean).length}/{rosterSlots.length}</strong>
      </div>
      <div className="final-roster-grid">
        {rosterSlots.map((slot, index) => {
          const player = roster[index];
          return (
            <div className="final-roster-player" key={`${slot}-${index}`}>
              <span>{slot}</span>
              <strong>{player ? player.name : "Empty"}</strong>
              <small>{player ? `${player.team} / ${player.decade}` : "No pick"}</small>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function RatingBar({ label, value }: { label: string; value: number }) {
  return (
    <div className="rating-row">
      <div>
        <span>{label}</span>
        <strong>{value}</strong>
      </div>
      <div className="bar-track">
        <span style={{ width: `${Math.max(0, Math.min(100, value))}%` }} />
      </div>
    </div>
  );
}

function DesignSystem({ onStart }: { onStart: () => void }) {
  return (
    <section className="system-screen screen-fade">
      <div className="section-heading compact">
        <p className="eyebrow">Figma-ready design system</p>
        <h2>17-0 interface kit</h2>
        <p className="muted">Reusable tokens and components for mobile and desktop layouts.</p>
      </div>
      <div className="system-grid">
        <article className="system-card">
          <h3>Color palette</h3>
          <div className="swatches">
            {["#05070d", "#071523", "#f8fafc", "#b7c0cc", "#0f8f51", "#d5a11e"].map((color) => (
              <span key={color} style={{ background: color }}>{color}</span>
            ))}
          </div>
        </article>
        <article className="system-card">
          <h3>Typography</h3>
          <p className="type-xl">League-bold display</p>
          <p className="type-body">Compact, high-contrast UI text for quick offensive draft decisions.</p>
        </article>
        <article className="system-card">
          <h3>Button styles</h3>
          <button className="primary-cta inline">Primary CTA</button>
          <button className="secondary-cta inline">Secondary</button>
          <button className="draft-button">Card action</button>
        </article>
        <article className="system-card">
          <h3>Player card component</h3>
          <PlayerCard player={players[5]} disabled={false} onDraft={() => undefined} />
        </article>
        <article className="system-card">
          <h3>Team/deck spin card</h3>
          <div className="spin-card mini">
            <div><span className="card-kicker">Team + decade</span><strong>Dallas Cowboys - 1990s</strong></div>
          </div>
        </article>
        <article className="system-card">
          <h3>Live lineup marker</h3>
          <button className="field-marker filled static-slot">
            <span>QB</span><strong>JM</strong><small>Set</small>
          </button>
        </article>
        <article className="system-card">
          <h3>Badge component</h3>
          <div className="badge-row">
            <span className="rating-badge legendary">1990s</span>
            <span className="rating-badge elite">1980s</span>
            <span className="rating-badge prime">2000s</span>
            <span className="rating-badge solid">2020s</span>
          </div>
        </article>
        <article className="system-card final-component">
          <h3>Final results component</h3>
          <strong>17-0</strong>
          <span>Perfect Season!</span>
        </article>
      </div>
      <div className="layout-notes">
        <div><strong>Mobile layout</strong><span>Single-column draft flow with the live offense field under the war room.</span></div>
        <div><strong>Desktop layout</strong><span>Offensive player board beside a sticky war-room and lineup field.</span></div>
      </div>
      <button className="primary-cta inline" onClick={onStart}>Start Draft</button>
    </section>
  );
}
