import express, { Request, Response } from 'express';

type Role = 'admin' | 'representative' | 'user';

interface User {
  id: number;
  name: string;
  role: Role;
}

interface Project {
  id: number;
  title: string;
  description: string;
  deadline: Date;
  isVotingActive: boolean;
}

interface Proposal {
  id: number;
  proposalId: number;
  content: string;
  votes: number;
}

let users: User[] = [];
let projects: Project[] = [];
let proposals: Proposal[] = [];

const app = express();
const port = 3000;

app.use(express.json());

app.post('/projects', (req: Request, res: Response) => {
  const { title, description, deadline } = req.body;

  const newProject: Project = {
    id: projects.length + 1,
    title,
    description,
    deadline: new Date(deadline),
    isVotingActive: false,
  };

  projects.push(newProject);
  res.status(201).json(newProject);
});


app.post('/proposals', (req: Request, res: Response) => {
  const { proposalId, content } = req.body;
  const proposal = projects.find(p => p.id === proposalId);

  if (!proposal || new Date() > proposal.deadline) {
    return res.status(400).json({ error: 'Invalid proposal or deadline has passed.' });
  }

  const newProgram: Proposal = {
    id: proposals.length + 1,
    proposalId,
    content,
    votes: 0,
  };

  proposals.push(newProgram);
  res.status(201).json(newProgram);
});


app.post('/votes', (req: Request, res: Response) => {
  const { programId } = req.body;
  const program = proposals.find(p => p.id === programId);

  if (!program) {
    return res.status(400).json({ error: 'Invalid program.' });
  }

  const proposal = projects.find(p => p.id === program.proposalId);
  if (!proposal || !proposal.isVotingActive) {
    return res.status(400).json({ error: 'Voting is not active for this proposal.' });
  }

  program.votes += 1;
  res.json({ message: 'Vote registered.' });
});


app.put('/proposals/:id/activate-voting', (req: Request, res: Response) => {
  const proposalId = parseInt(req.params.id);
  const proposal = projects.find(p => p.id === proposalId);

  if (!proposal || new Date() < proposal.deadline) {
    return res.status(400).json({ error: 'Invalid proposal or deadline has not passed yet.' });
  }

  proposal.isVotingActive = true;
  res.json(proposal);
});


app.get('/proposals/:id/results', (req: Request, res: Response) => {
  const proposalId = parseInt(req.params.id);
  const proposal = projects.find(p => p.id === proposalId);

  if (!proposal || proposal.isVotingActive) {
    return res.status(400).json({ error: 'Voting is still active or proposal not found.' });
  }

  const proposalPrograms = proposals.filter(p => p.proposalId === proposalId);
  const results = proposalPrograms.map(p => ({ program: p.content, votes: p.votes }));

  res.json(results);
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
